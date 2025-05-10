import {
  AnalyticsTaskCompletionOutput,
  QueryAnalyticsTaskCompletionArgs
} from '@app/frontend/src/gql-generated/graphql';
import { TaskProgress } from '@prisma/client';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTaskCompletionResolver(
  _,
  { input }: QueryAnalyticsTaskCompletionArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTaskCompletionOutput> {
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
    OR: [
      // Include tasks created in the date range
      {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      // Include tasks completed in the date range
      {
        progress: TaskProgress.completed,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    ]
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
  const dateMap = new Map<string, { completed: number; total: number }>();

  // Initialize all dates in the range with zero counts
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dateMap.set(dateStr, { completed: 0, total: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill in actual task counts
  tasks.forEach(task => {
    const date = task.createdAt.toISOString().split('T')[0];
    const current = dateMap.get(date) || { completed: 0, total: 0 };
    dateMap.set(date, {
      completed: current.completed + (task.progress === TaskProgress.completed ? 1 : 0),
      total: current.total + 1
    });
  });

  const items = Array.from(dateMap.entries()).map(([date, stats]) => ({
    date: new Date(date),
    completed: stats.completed,
    total: stats.total
  }));

  const total = tasks.length;
  const completed = tasks.filter(task => task.progress === TaskProgress.completed).length;
  const completionRate = total > 0 ? completed / total : 0;

  return {
    items,
    total,
    completed,
    completionRate
  };
}
