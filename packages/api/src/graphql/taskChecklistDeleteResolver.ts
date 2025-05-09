import { MutationTaskChecklistDeleteArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskChecklistDeleteResolver(
  _,
  { input }: MutationTaskChecklistDeleteArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const { taskId, sortOrder } = await prisma.taskChecklist.findUniqueOrThrow({
    where: { id: input.id },
    select: { taskId: true, sortOrder: true }
  });

  await prisma.taskChecklist.updateMany({
    where: { taskId, sortOrder: { gt: sortOrder } },
    data: {
      sortOrder: {
        decrement: 1
      }
    }
  });

  await prisma.taskChecklist.delete({
    where: { id: input.id }
  });

  const task = await prisma.task.findUniqueOrThrow({
    where: { id: taskId }
  });

  return toTaskSchema(task);
}
