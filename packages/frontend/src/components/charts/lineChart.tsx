import { ReactNode } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as LineChartRe,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { strokeColors } from './helpers/colors';

interface LineChartProps {
  data?: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
}

export function LineChart({ data = [] }: LineChartProps): ReactNode {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data.map(item => ({
    name: formatDate(item.date),
    completed: item.completed,
    total: item.total
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChartRe data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />
          {Object.keys(chartData[0] || {})
            .filter(key => key !== 'name')
            .map((item, index) => (
              <Line
                key={`${item}#${index}`}
                dataKey={item}
                type="monotone"
                stroke={strokeColors[index]}
                activeDot={{ r: 7 }}
              />
            ))}
        </LineChartRe>
      </ResponsiveContainer>
    </div>
  );
}
