import { ReactNode } from 'react';
import {
  Bar,
  BarChart as BarChartRe,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fillColors } from './helpers/colors';

interface BarChartStackedProps {
  data?: Array<{
    priority: string;
    notStarted: number;
    inProgress: number;
    completed: number;
    total: number;
  }>;
}

export function BarChartStacked({ data = [] }: BarChartStackedProps): ReactNode {
  const chartData = data.map(item => ({
    name: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
    'Not Started': item.notStarted,
    'In Progress': item.inProgress,
    Completed: item.completed
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChartRe data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />
          {Object.keys(chartData[0] || {})
            .filter(key => key !== 'name')
            .map((item, index) => (
              <Bar key={`${item}#${index}`} dataKey={item} stackId="a" fill={fillColors[index]} />
            ))}
        </BarChartRe>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChartDefault(): ReactNode {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChartRe data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />
          {Object.keys(data.map(({ name, ...rest }) => rest)[0]).map((item, index) => (
            <Bar key={`${item}#${index}`} dataKey={item} fill={fillColors[index]} />
          ))}
        </BarChartRe>
      </ResponsiveContainer>
    </div>
  );
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
    eg: 1200
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
    eg: 1400
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
    eg: 300
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
    eg: 400
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
    eg: 700
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
    eg: 5000
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
    eg: 1500
  }
];
