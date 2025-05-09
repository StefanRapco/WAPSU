import { ReactNode } from 'react';
import {
  Area,
  AreaChart as AreaChartRe,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fillColors } from './helpers/colors';

interface AreaChartProps {
  data?: Array<{
    date: string;
    created: number;
    completed: number;
  }>;
}

export function AreaChart({ data = [] }: AreaChartProps): ReactNode {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChartRe data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDate} />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} labelFormatter={formatDate} />
          <Legend />
          <Area
            type="monotone"
            dataKey="created"
            stackId="1"
            stroke={fillColors[0]}
            fill={fillColors[0]}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            stroke={fillColors[1]}
            fill={fillColors[1]}
          />
        </AreaChartRe>
      </ResponsiveContainer>
    </div>
  );
}
