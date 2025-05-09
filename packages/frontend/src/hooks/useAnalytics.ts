import { useQuery } from '@apollo/client';
import { gql } from '../gql-generated/gql';
import { AnalyticsAction } from '../gql-generated/graphql';
import { useIdentity } from './useIdentity';

const ANALYTICS_TASK_COMPLETION = gql(`
  query AnalyticsTaskCompletion($input: AnalyticsTaskCompletionInput!) {
    analyticsTaskCompletion(input: $input) {
      items {
        date
        completed
        total
      }
      total
      completed
      completionRate
    }
  }
`);

const ANALYTICS_TASK_DISTRIBUTION = gql(`
  query AnalyticsTaskDistribution($input: AnalyticsTaskDistributionInput!) {
    analyticsTaskDistribution(input: $input) {
      notStarted
      inProgress
      completed
      total
    }
  }
`);

const ANALYTICS_TASK_PRIORITY = gql(`
  query AnalyticsTaskPriority($input: AnalyticsTaskPriorityInput!) {
    analyticsTaskPriority(input: $input) {
      items {
        priority
        notStarted
        inProgress
        completed
        total
      }
    }
  }
`);

const ANALYTICS_TEAM_PERFORMANCE = gql(`
  query AnalyticsTeamPerformance($input: AnalyticsTeamPerformanceInput!) {
    analyticsTeamPerformance(input: $input) {
      items {
        teamId
        teamName
        completionRate
        averageCompletionTime
        onTimeDeliveryRate
        priorityDistribution
        activeTasksRatio
      }
    }
  }
`);

const ANALYTICS_TASK_TIMELINE = gql(`
  query AnalyticsTaskTimeline($input: AnalyticsTaskTimelineInput!) {
    analyticsTaskTimeline(input: $input) {
      items {
        date
        created
        completed
      }
    }
  }
`);

const ANALYTICS_TASK_HEALTH = gql(`
  query AnalyticsTaskHealth($input: AnalyticsTaskHealthInput!) {
    analyticsTaskHealth(input: $input) {
      overdueTasks
      dueToday
      dueThisWeek
      completionRate
    }
  }
`);

export function useTaskCompletionAnalytics(
  action: 'all' | 'team' | 'individual',
  teamId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const { identity } = useIdentity();

  const variables = {
    input: {
      teamId: teamId === 'individual' ? undefined : teamId,
      userId: !teamId || teamId === 'individual' ? identity?.id : undefined,
      action: action as AnalyticsAction,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TASK_COMPLETION, {
    variables,
    skip: false,
    onError: error => console.error('Task Completion Analytics Error:', error)
  });
}

export function useTaskDistributionAnalytics(
  action: 'all' | 'team' | 'individual',
  teamId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const { identity } = useIdentity();
  const variables = {
    input: {
      teamId: teamId === 'individual' ? undefined : teamId,
      userId: !teamId || teamId === 'individual' ? identity?.id : undefined,
      action: action as AnalyticsAction,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TASK_DISTRIBUTION, {
    variables,
    skip: false,
    onError: error => console.error('Task Distribution Analytics Error:', error)
  });
}

export function useTaskPriorityAnalytics(
  action: 'all' | 'team' | 'individual',
  teamId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const { identity } = useIdentity();
  const variables = {
    input: {
      teamId: teamId === 'individual' ? undefined : teamId,
      userId: !teamId || teamId === 'individual' ? identity?.id : undefined,
      action: action as AnalyticsAction,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TASK_PRIORITY, {
    variables,
    skip: false,
    onError: error => console.error('Task Priority Analytics Error:', error)
  });
}

export function useTeamPerformanceAnalytics(teamIds: string[], startDate?: Date, endDate?: Date) {
  const filteredTeamIds = teamIds.filter(id => id !== '');

  const variables = {
    input: {
      teamIds: filteredTeamIds,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TEAM_PERFORMANCE, {
    variables,
    skip: filteredTeamIds.length === 0,
    onError: error => {
      console.error('Team Performance Analytics Error:', error);
    }
  });
}

export function useTaskTimelineAnalytics(
  action: 'all' | 'team' | 'individual',
  teamId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const { identity } = useIdentity();
  const variables = {
    input: {
      teamId: teamId === 'individual' ? undefined : teamId,
      userId: !teamId || teamId === 'individual' ? identity?.id : undefined,
      action: action as AnalyticsAction,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TASK_TIMELINE, {
    variables,
    skip: false,
    onError: error => console.error('Task Timeline Analytics Error:', error)
  });
}

export function useTaskHealthAnalytics(
  action: 'all' | 'team' | 'individual',
  teamId?: string,
  startDate?: Date,
  endDate?: Date
) {
  const { identity } = useIdentity();
  const variables = {
    input: {
      teamId: teamId === 'individual' ? undefined : teamId,
      userId: !teamId || teamId === 'individual' ? identity?.id : undefined,
      action: action as AnalyticsAction,
      startDate:
        startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: endDate?.toISOString() ?? new Date().toISOString()
    }
  };

  return useQuery(ANALYTICS_TASK_HEALTH, {
    variables,
    skip: false,
    onError: error => console.error('Task Health Analytics Error:', error)
  });
}
