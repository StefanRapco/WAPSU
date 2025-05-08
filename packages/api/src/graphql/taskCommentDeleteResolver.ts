import { MutationTaskCommentDeleteArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCommentDeleteResolver(
  _,
  { input }: MutationTaskCommentDeleteArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const comment = await prisma.taskComment.delete({
    where: { id: input.id },
    select: {
      task: true
    }
  });

  return toTaskSchema(comment.task);
}
