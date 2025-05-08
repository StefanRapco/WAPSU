import { MutationTaskCommentDeleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function taskCommentDeleteResolver(
  _,
  { input }: MutationTaskCommentDeleteArgs,
  { identity }: InvocationContext
): Promise<void> {
  await prisma.taskComment.delete({
    where: { id: input.id }
  });
}
