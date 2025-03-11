import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart as ComposedChartRe,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { fillColors, strokeColors } from './helpers/colors';

export function ComposedChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChartRe data={data} margin={{ top: 20, right: 80, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="name"
            label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }}
            scale="band"
          />
          <YAxis label={{ value: 'Index', angle: -90, position: 'insideLeft' }} />
          <Tooltip contentStyle={{ color: 'black' }} />
          <Legend />

          {Object.keys(data.map(({ name, ...rest }) => rest)[0]).map((item, index) => {
            if (index === 0)
              return (
                <Area
                  key={`${item}#${index}`}
                  type="monotone"
                  dataKey={item}
                  fill={fillColors[index]}
                  stroke={strokeColors[index]}
                />
              );
            if (index === 1)
              return (
                <Bar
                  key={`${item}#${index}`}
                  dataKey={item}
                  barSize={20}
                  fill={fillColors[index]}
                />
              );
            if (index === 2)
              return (
                <Line
                  key={`${item}#${index}`}
                  type="monotone"
                  dataKey={item}
                  stroke={strokeColors[index]}
                />
              );

            throw new Error('Error! Composed Chart');
          })}
        </ComposedChartRe>
      </ResponsiveContainer>
    </div>
  );
}

const data = [
  {
    name: 'Page A',
    uv: 590,
    pv: 800,
    amt: 1400
  },
  {
    name: 'Page B',
    uv: 868,
    pv: 967,
    amt: 1506
  },
  {
    name: 'Page C',
    uv: 1397,
    pv: 1098,
    amt: 989
  },
  {
    name: 'Page D',
    uv: 1480,
    pv: 1200,
    amt: 1228
  },
  {
    name: 'Page E',
    uv: 1520,
    pv: 1108,
    amt: 1100
  },
  {
    name: 'Page F',
    uv: 1400,
    pv: 680,
    amt: 1700
  }
];
