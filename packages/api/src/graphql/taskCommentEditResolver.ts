import { MutationTaskCommentEditArgs, TaskComment } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCommentEditResolver(
  _,
  { input }: MutationTaskCommentEditArgs,
  { identity }: InvocationContext
): Promise<TaskComment> {
  const { id, content } = input;

  const comment = await prisma.taskComment.update({
    where: { id },
    data: {
      content,
      isEdited: true
    },
    include: {
      task: true
    }
  });

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    isEdited: comment.isEdited,
    task: toTaskSchema(comment.task)
  };
}
