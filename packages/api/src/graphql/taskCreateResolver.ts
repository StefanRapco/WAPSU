import { MutationTaskCreateArgs, Task } from '@app/frontend/src/gql-generated/graphql';
import { sendEmail } from '../email/email';
import { taskAssignedEmail } from '../email/taskAssigned';
import { taskCreatedEmail } from '../email/taskCreated';
import { uuid } from '../helpers';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';
import { toTaskSchema } from './mapping/toTaskMapping';

export async function taskCreateResolver(
  _,
  { input }: MutationTaskCreateArgs,
  { identity }: InvocationContext
): Promise<Task> {
  const { name, bucketId, userId, teamId } = input;

  if (userId == null && teamId == null) throw new Error('Either userId or teamId must be provided');

  if (userId != null && teamId != null) throw new Error('Cannot provide both userId and teamId');

  const bucket = await prisma.bucket.findUniqueOrThrow({
    where: { id: bucketId },
    select: {
      tasks: true,
      team: {
        select: {
          id: true,
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
  });

  const task = await prisma.task.create({
    data: {
      id: uuid(),
      name,
      sortOrder: bucket.tasks.length,
      bucketId
    },
    include: {
      assignees: true,
      comments: true,
      checklist: true,
      bucket: {
        select: {
          team: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  // Send notifications based on user preferences
  if (teamId) {
    const team = await prisma.team.findUniqueOrThrow({
      where: { id: teamId },
      select: { name: true, users: { select: { user: true } } }
    });

    // Send notifications to team members if they have team notifications enabled
    for (const { user } of team.users) {
      if (user.teamNotifications) {
        await sendEmail({
          htmlContent: taskAssignedEmail({
            userFirstName: user.firstName,
            taskName: task.name,
            teamName: team.name,
            taskPriority: task.priority,
            taskDueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'
          }),
          subject: `New task created in ${team.name}`,
          to: [user.email]
        });
      }
    }
  }

  // Send individual notifications if a specific user is assigned
  if (userId) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        individualNotifications: true
      }
    });

    if (assignedUser?.individualNotifications) {
      await sendEmail({
        htmlContent: taskCreatedEmail({
          userFirstName: assignedUser.firstName,
          taskTitle: task.name,
          taskPriority: task.priority,
          taskDueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set',
          taskDescription: task.notes || 'No description provided'
        }),
        subject: 'New task created or assigned to you in DoSync!',
        to: [assignedUser.email]
      });
    }
  }

  return toTaskSchema(task);
}
