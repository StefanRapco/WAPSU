import { MutationTaskDeleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function taskDeleteResolver(
  _,
  { input }: MutationTaskDeleteArgs,
  { identity }: InvocationContext
): Promise<void> {
  await prisma.taskChecklist.deleteMany({
    where: { taskId: input.id }
  });

  await prisma.taskComment.deleteMany({
    where: { taskId: input.id }
  });

  await prisma.task.delete({
    where: { id: input.id }
  });
}
