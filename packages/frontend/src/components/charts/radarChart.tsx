import { ReactNode } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RadarChartRe,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { fillColors } from './helpers/colors';

interface PriorityDistribution {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

interface RadarChartProps {
  data?: Array<{
    teamName: string;
    completionRate: number;
    onTimeDeliveryRate: number;
    priorityDistribution: PriorityDistribution;
    activeTasksRatio: number;
    averageCompletionTime: number;
  }>;
}

export function RadarChart({ data = [] }: RadarChartProps): ReactNode {
  if (data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <p>Select teams to compare their performance</p>
      </div>
    );
  }

  const metrics = [
    'Completion Rate',
    'On-Time Delivery',
    'Priority Balance',
    'Active Tasks',
    'Completion Time'
  ];

  // Transform data into the format expected by Recharts
  const transformedData = metrics.map(metric => {
    const dataPoint: any = { metric };
    data.forEach(team => {
      // Calculate priority balance score (0-100)
      const priorities = team.priorityDistribution;
      const total = priorities.low + priorities.medium + priorities.high + priorities.urgent;
      const idealDistribution = total / 4; // Equal distribution
      const deviation =
        Math.abs(priorities.low - idealDistribution) +
        Math.abs(priorities.medium - idealDistribution) +
        Math.abs(priorities.high - idealDistribution) +
        Math.abs(priorities.urgent - idealDistribution);
      const priorityBalance = Math.max(0, 100 - (deviation / total) * 100);

      // Map metric names to actual values
      const value = (() => {
        switch (metric) {
          case 'Completion Rate':
            return Math.round(team.completionRate * 100);
          case 'On-Time Delivery':
            return Math.round(team.onTimeDeliveryRate * 100);
          case 'Priority Balance':
            return Math.round(priorityBalance);
          case 'Active Tasks':
            return Math.round(team.activeTasksRatio * 100);
          case 'Completion Time':
            return Math.round(team.averageCompletionTime);
          default:
            return 0;
        }
      })();

      dataPoint[team.teamName] = value;
    });
    return dataPoint;
  });

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChartRe cx="50%" cy="50%" outerRadius="80%" data={transformedData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          {data.map((team, index) => (
            <Radar
              key={team.teamName}
              name={team.teamName}
              dataKey={team.teamName}
              stroke={fillColors[index % fillColors.length]}
              fill={fillColors[index % fillColors.length]}
              fillOpacity={0.3}
            />
          ))}
          <Legend />
          <Tooltip contentStyle={{ color: 'black' }} />
        </RadarChartRe>
      </ResponsiveContainer>
    </div>
  );
}
