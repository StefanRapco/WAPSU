import {
  AnalyticsTaskHealthOutput,
  QueryAnalyticsTaskHealthArgs
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTaskHealthResolver(
  _,
  { input }: QueryAnalyticsTaskHealthArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTaskHealthOutput> {
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
      progress: true,
      dueDate: true
    }
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const overdueTasks = tasks.filter(
    task => task.dueDate && task.dueDate < now && task.progress !== 'completed'
  ).length;

  const dueToday = tasks.filter(
    task =>
      task.dueDate &&
      task.dueDate >= today &&
      task.dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
  ).length;

  const dueThisWeek = tasks.filter(
    task => task.dueDate && task.dueDate >= today && task.dueDate < weekEnd
  ).length;

  const completed = tasks.filter(task => task.progress === 'completed').length;
  const completionRate = tasks.length > 0 ? completed / tasks.length : 0;

  return {
    overdueTasks,
    dueToday,
    dueThisWeek,
    completionRate
  };
}
