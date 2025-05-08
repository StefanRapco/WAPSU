import {
  MutationTaskChecklistEditArgs,
  TaskChecklist
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskChecklistEditResolver(
  _,
  { input }: MutationTaskChecklistEditArgs,
  { identity }: InvocationContext
): Promise<TaskChecklist> {
  const { id, name, completed, sortOrder } = input;

  const checklist = await prisma.taskChecklist.update({
    where: { id },
    data: {
      name: name ?? undefined,
      completed: completed ?? undefined,
      sortOrder: sortOrder ?? undefined
    },
    include: {
      task: true
    }
  });

  return {
    id: checklist.id,
    name: checklist.name,
    createdAt: checklist.createdAt,
    completed: checklist.completed,
    sortOrder: checklist.sortOrder,
    task: toTaskSchema(checklist.task)
  };
}
