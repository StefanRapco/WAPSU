import {
  AnalyticsTeamPerformanceOutput,
  QueryAnalyticsTeamPerformanceArgs
} from '@app/frontend/src/gql-generated/graphql';
import { InvocationContext } from '../invocationContext';
import { prisma } from '../prisma';

export async function analyticsTeamPerformanceResolver(
  _,
  { input }: QueryAnalyticsTeamPerformanceArgs,
  { identity }: InvocationContext
): Promise<AnalyticsTeamPerformanceOutput> {
  const { teamIds, startDate, endDate } = input;

  const teams = await prisma.team.findMany({
    where: {
      id: { in: teamIds },
      users: {
        some: {
          userId: identity.id
        }
      }
    },
    include: {
      buckets: {
        include: {
          tasks: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate
              }
            },
            include: {
              assignees: true
            }
          }
        }
      }
    }
  });

  const items = teams.map(team => {
    const allTasks = team.buckets.flatMap(bucket => bucket.tasks);
    const completedTasks = allTasks.filter(task => task.progress === 'completed');
    const overdueTasks = allTasks.filter(
      task => task.dueDate && task.dueDate < new Date() && task.progress !== 'completed'
    );

    const completionRate = allTasks.length > 0 ? completedTasks.length / allTasks.length : 0;
    const onTimeDeliveryRate =
      allTasks.length > 0 ? (allTasks.length - overdueTasks.length) / allTasks.length : 0;

    const priorityDistribution = {
      low: allTasks.filter(task => task.priority === 'low').length,
      medium: allTasks.filter(task => task.priority === 'medium').length,
      high: allTasks.filter(task => task.priority === 'high').length,
      urgent: allTasks.filter(task => task.priority === 'urgent').length
    };

    const activeTasksRatio =
      allTasks.length > 0
        ? allTasks.filter(task => task.progress === 'inProgress').length / allTasks.length
        : 0;

    return {
      teamId: team.id,
      teamName: team.name,
      completionRate,
      averageCompletionTime: 0, // TODO: Implement this when we have task completion timestamps
      onTimeDeliveryRate,
      priorityDistribution,
      activeTasksRatio
    };
  });

  return { items };
}
