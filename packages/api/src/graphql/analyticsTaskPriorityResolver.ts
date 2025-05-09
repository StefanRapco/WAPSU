import {
  AnalyticsTaskPriorityOutput,
  QueryAnalyticsTaskPriorityArgs,
  TaskPriority
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTaskPriorityResolver(
  _,
  { input }: QueryAnalyticsTaskPriorityArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTaskPriorityOutput> {
  const { teamId, startDate, endDate, action } = input;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: identity.id },
    select: { teams: true }
  });

  let bucketWhere = {};

  switch (action) {
    case 'all':
      // Get tasks from all teams user is part of and individual tasks
      bucketWhere = {
        OR: [{ teamId: { in: user.teams.map(t => t.teamId) } }, { userId: identity.id }]
      };
      break;
    case 'team':
      // Get tasks only from specific team
      bucketWhere = {
        teamId
      };
      break;
    case 'individual':
      // Get only individual tasks
      bucketWhere = {
        userId: identity.id,
        teamId: null
      };
      break;
  }

  const where = {
    bucket: bucketWhere,
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  };

  const tasks = await prisma.task.findMany({
    where,
    select: {
      priority: true,
      progress: true
    }
  });

  const items = Object.values(TaskPriority).map(priority => {
    const priorityTasks = tasks.filter(task => task.priority === priority);
    return {
      priority,
      notStarted: priorityTasks.filter(task => task.progress === 'notStarted').length,
      inProgress: priorityTasks.filter(task => task.progress === 'inProgress').length,
      completed: priorityTasks.filter(task => task.progress === 'completed').length,
      total: priorityTasks.length
    };
  });

  return { items };
}
