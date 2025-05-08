import { MutationTaskEditArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskEditResolver(
  _,
  { input }: MutationTaskEditArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const {
    id,
    name,
    notes,
    startDate,
    dueDate,
    progress,
    priority,
    bucketId,
    sortOrder,
    assigneeIds,
    tagIds
  } = input;

  await handleSortOrder(id, sortOrder, bucketId);

  const task = await prisma.task.update({
    where: { id },
    data: {
      name: name ?? undefined,
      notes: notes ?? undefined,
      startDate: startDate ?? undefined,
      dueDate: dueDate ?? undefined,
      progress: progress ?? undefined,
      priority: priority ?? undefined,
      assignees: assigneeIds
        ? {
            set: assigneeIds.map(id => ({ id }))
          }
        : undefined,
      tags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map(tagId => ({
              tagId
            }))
          }
        : undefined
    },
    include: {
      assignees: true,
      tags: true,
      comments: true,
      checklist: true,
      bucket: true
    }
  });

  return toTaskSchema(task);
}

async function handleSortOrder(
  taskId: string,
  sortOrder: number | null | undefined,
  bucketId: string | null | undefined
) {
  const task = await prisma.task.findUniqueOrThrow({
    where: {
      id: taskId
    },
    select: {
      sortOrder: true,
      bucketId: true
    }
  });

  if (bucketId == null) return;
  if (sortOrder == null) return;
  if (task.bucketId === bucketId && task.sortOrder === sortOrder) return;

  if (bucketId === task.bucketId) {
    // same bucket - goes down

    if (task.sortOrder < sortOrder) {
      await prisma.task.updateMany({
        where: {
          bucketId: task.bucketId,
          sortOrder: {
            gt: task.sortOrder,
            lte: sortOrder
          }
        },
        data: {
          sortOrder: {
            decrement: 1
          }
        }
      });
    }

    if (task.sortOrder > sortOrder) {
      // same bucket - goes up
      await prisma.task.updateMany({
        where: {
          bucketId: task.bucketId,
          sortOrder: {
            lt: task.sortOrder,
            gte: sortOrder
          }
        },
        data: {
          sortOrder: {
            increment: 1
          }
        }
      });
    }

    await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        sortOrder
      }
    });

    return;
  }

  // different bucket
  await prisma.task.updateMany({
    where: {
      bucketId: task.bucketId,
      sortOrder: {
        gt: task.sortOrder
      }
    },
    data: {
      sortOrder: {
        decrement: 1
      }
    }
  });

  await prisma.task.updateMany({
    where: {
      bucketId,
      sortOrder: {
        gte: sortOrder
      }
    },
    data: {
      sortOrder: {
        increment: 1
      }
    }
  });

  await prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      sortOrder,
      bucketId
    }
  });
}
