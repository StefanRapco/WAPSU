import { ReactNode } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart as RechartsComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fillColors } from './helpers/colors';

interface ComposedChartProps {
  data?: {
    overdueTasks: number;
    dueToday: number;
    dueThisWeek: number;
    completionRate: number;
  };
}

export function ComposedChart({ data }: ComposedChartProps): ReactNode {
  if (!data) return null;

  const chartData = [
    {
      date: 'Current',
      overdue: data.overdueTasks,
      dueToday: data.dueToday,
      dueThisWeek: data.dueThisWeek,
      completionRate: data.completionRate
    }
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsComposedChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => {
            if (name === 'Completion Rate') {
              return [((value as number) * 100).toFixed(2) + '%', name];
            }
            return [value, name];
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="overdue"
          fill={fillColors[0]}
          stroke={fillColors[0]}
          name="Overdue Tasks"
        />
        <Bar dataKey="dueToday" fill={fillColors[1]} name="Due Today" />
        <Bar dataKey="dueThisWeek" fill={fillColors[2]} name="Due This Week" />
        <Line
          type="monotone"
          dataKey="completionRate"
          stroke={fillColors[3]}
          name="Completion Rate"
        />
      </RechartsComposedChart>
    </ResponsiveContainer>
  );
}
