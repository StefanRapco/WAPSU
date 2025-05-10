import { MutationTaskEditArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { taskUpdatedEmail } from '../email/taskUpdated';
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
    assigneeIds
  } = input;

  // Get the task before update to track changes
  const oldTask = await prisma.task.findUniqueOrThrow({
    where: { id },
    include: {
      assignees: true,
      bucket: {
        select: {
          userId: true,
          teamId: true,
          team: {
            select: {
              name: true,
              users: {
                select: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      individualNotifications: true,
                      teamNotifications: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

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
        : undefined
    },
    include: {
      assignees: true,
      comments: {
        include: {
          author: true
        }
      },
      checklist: true,
      bucket: {
        select: {
          userId: true,
          teamId: true,
          team: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  // Track changes for notification
  const changes: string[] = new Array();
  if (name && name !== oldTask.name) changes.push(`Name changed to "${name}"`);
  if (notes && notes !== oldTask.notes) changes.push('Notes updated');
  if (startDate && startDate !== oldTask.startDate)
    changes.push(`Start date changed to ${new Date(startDate).toLocaleDateString()}`);
  if (dueDate && dueDate !== oldTask.dueDate)
    changes.push(`Due date changed to ${new Date(dueDate).toLocaleDateString()}`);
  if (progress && progress !== oldTask.progress) changes.push(`Progress changed to ${progress}`);
  if (priority && priority !== oldTask.priority) changes.push(`Priority changed to ${priority}`);

  // Track assignee changes
  const oldAssigneeIds = new Set(oldTask.assignees.map(a => a.id));
  const newAssigneeIds = new Set(assigneeIds || []);

  const addedAssignees = [...newAssigneeIds].filter(id => !oldAssigneeIds.has(id));
  const removedAssignees = [...oldAssigneeIds].filter(id => !newAssigneeIds.has(id));

  if (addedAssignees.length > 0) {
    const addedUsers = await prisma.user.findMany({
      where: { id: { in: addedAssignees } },
      select: { firstName: true, lastName: true }
    });
    changes.push(
      `Added assignees: ${addedUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ')}`
    );
  }

  if (removedAssignees.length > 0) {
    const removedUsers = await prisma.user.findMany({
      where: { id: { in: removedAssignees } },
      select: { firstName: true, lastName: true }
    });
    changes.push(
      `Removed assignees: ${removedUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ')}`
    );
  }

  // Send notifications if there are changes
  if (changes.length > 0) {
    const changesText = changes.join('\n');
    const usersToNotify = new Set<string>();

    // If task is in a team bucket, notify team members with team notifications enabled
    if (task.bucket.teamId) {
      const team = await prisma.team.findUnique({
        where: { id: task.bucket.teamId },
        include: {
          users: {
            include: {
              user: {
                select: {
                  email: true,
                  firstName: true,
                  teamNotifications: true
                }
              }
            }
          }
        }
      });

      if (team) {
        for (const { user } of team.users) {
          if (user.teamNotifications) {
            usersToNotify.add(user.email);
          }
        }
      }
    }
    // If task is in a user bucket, notify the user if they have individual notifications enabled
    else if (task.bucket.userId) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: task.bucket.userId },
        select: {
          email: true,
          firstName: true,
          individualNotifications: true
        }
      });

      if (user.individualNotifications) {
        usersToNotify.add(user.email);
      }
    }

    // Add assignees with individual notifications enabled
    for (const assignee of task.assignees) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: assignee.id },
        select: {
          email: true,
          firstName: true,
          individualNotifications: true
        }
      });

      if (user.individualNotifications) {
        usersToNotify.add(user.email);
      }
    }

    // Send notifications
    for (const email of usersToNotify) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { email },
        select: { firstName: true }
      });

      await sendEmail({
        htmlContent: taskUpdatedEmail({
          userFirstName: user.firstName,
          taskName: task.name,
          teamName: task.bucket.team?.name ?? 'Personal',
          changes: changesText
        }),
        subject: `Task "${task.name}" has been updated`,
        to: [email]
      });
    }
  }

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
