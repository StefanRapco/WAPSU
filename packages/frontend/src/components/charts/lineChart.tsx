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

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
];
