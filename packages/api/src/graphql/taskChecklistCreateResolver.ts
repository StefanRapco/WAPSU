import {
  MutationTaskChecklistCreateArgs,
  TaskChecklist
} from '@app/frontend/src/gql-generated/graphql';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskChecklistCreateResolver(
  _,
  { input }: MutationTaskChecklistCreateArgs,
  { identity }: InvocationContext
): Promise<TaskChecklist> {
  const { name, sortOrder, taskId } = input;

  const checklist = await prisma.taskChecklist.create({
    data: {
      id: uuid(),
      name,
      sortOrder,
      taskId,
      completed: false
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
