import {
  AnalyticsTaskTimelineOutput,
  QueryAnalyticsTaskTimelineArgs
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTaskTimelineResolver(
  _,
  { input }: QueryAnalyticsTaskTimelineArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTaskTimelineOutput> {
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
      createdAt: true,
      progress: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Group tasks by date
  const dateMap = new Map<string, { created: number; completed: number }>();

  // Initialize all dates in the range with zero counts
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dateMap.set(dateStr, { created: 0, completed: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual task counts
  tasks.forEach(task => {
    const date = task.createdAt.toISOString().split('T')[0];
    const current = dateMap.get(date) || { created: 0, completed: 0 };
    dateMap.set(date, {
      created: current.created + 1,
      completed: current.completed + (task.progress === 'completed' ? 1 : 0)
    });
  });

  const items = Array.from(dateMap.entries()).map(([date, stats]) => ({
    date: new Date(date),
    created: stats.created,
    completed: stats.completed
  }));

  return { items };
}
