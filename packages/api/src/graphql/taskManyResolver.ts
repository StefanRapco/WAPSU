import { QueryTaskManyArgs, TaskManyOutput } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema, toTaskWhere } from './mapping/toTaskMapping';

export async function taskManyResolver(
  _,
  { input }: QueryTaskManyArgs,
  { identity }: InvocationContext
): Promise<TaskManyOutput> {
  const where = toTaskWhere({ input: input?.filter, identity });

  const tasks = await prisma.task.findMany({
    where: { AND: where },
    orderBy: { sortOrder: 'asc' },
    include: {
      assignees: true,
      tags: true,
      comments: true,
      checklist: true,
      bucket: {
        include: {
          team: true,
          user: true
        }
      }
    }
  });

  return {
    items: tasks.map(toTaskSchema),
    total: tasks.length,
    hasMore: false
  };
}
