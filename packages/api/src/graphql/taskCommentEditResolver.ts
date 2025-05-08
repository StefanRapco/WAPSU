import { MutationTaskCommentEditArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCommentEditResolver(
  _,
  { input }: MutationTaskCommentEditArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const { id, content } = input;

  const comment = await prisma.taskComment.update({
    where: { id },
    data: {
      content,
      isEdited: true
    },
    select: {
      task: true
    }
  });

  return toTaskSchema(comment.task);
}
