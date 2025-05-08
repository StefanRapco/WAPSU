import {
  MutationTaskCommentCreateArgs,
  TaskComment
} from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCommentCreateResolver(
  _,
  { input }: MutationTaskCommentCreateArgs,
  { identity }: InvocationContext
): Promise<TaskComment> {
  const { content, taskId } = input;

  const comment = await prisma.taskComment.create({
    data: {
      id: uuid(),
      content,
      taskId,
      isEdited: false
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
