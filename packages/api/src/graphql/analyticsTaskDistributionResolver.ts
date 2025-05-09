import {
  AnalyticsTaskDistributionOutput,
  QueryAnalyticsTaskDistributionArgs
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTaskDistributionResolver(
  _,
  { input }: QueryAnalyticsTaskDistributionArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTaskDistributionOutput> {
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
      progress: true
    }
  });

  const notStarted = tasks.filter(task => task.progress === 'notStarted').length;
  const inProgress = tasks.filter(task => task.progress === 'inProgress').length;
  const completed = tasks.filter(task => task.progress === 'completed').length;
  const total = tasks.length;

  const result = {
    notStarted,
    inProgress,
    completed,
    total
  };

  return result;
}
