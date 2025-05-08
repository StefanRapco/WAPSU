import { MutationTaskChecklistDeleteArgs } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function taskChecklistDeleteResolver(
  _,
  { input }: MutationTaskChecklistDeleteArgs,
  { identity }: InvocationContext
): Promise<void> {
  await prisma.taskChecklist.delete({
    where: { id: input.id }
  });
}
