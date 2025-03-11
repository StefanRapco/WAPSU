import {
  Area,
  AreaChart as AreaChartRe,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fillColors, strokeColors } from './helpers/colors';

export function AreaChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChartRe
          width={500}
          height={400}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip contentStyle={{ color: 'black' }} />

          {Object.keys(data.map(({ name, ...rest }) => rest)[0]).map((item, index) => (
            <Area
              key={`${item}#${index}`}
              dataKey={item}
              type="monotone"
              stackId="1"
              fill={fillColors[index]}
              stroke={strokeColors[index]}
            />
          ))}
        </AreaChartRe>
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
