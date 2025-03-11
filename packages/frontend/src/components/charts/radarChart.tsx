import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RadarChartRe,
  ResponsiveContainer
} from 'recharts';
import { fillColors, strokeColors } from './helpers/colors';

export function RadarChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChartRe cx="50%" cy="50%" outerRadius="80%" data={data.data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          {Object.keys(data.data.map(({ fullMark, subject, ...rest }) => rest)[0]).map(
            (item, index) => (
              <Radar
                key={`${item}#${index}`}
                name={data.keys[index]}
                dataKey={item}
                stroke={strokeColors[index]}
                fill={fillColors[index]}
                fillOpacity={0.6}
              />
            )
          )}
          <Legend />
        </RadarChartRe>
      </ResponsiveContainer>
    </div>
  );
}

const dataChart = [
  {
    subject: 'Math',
    dataA: 120,
    dataB: 110,
    fullMark: 150
  },
  {
    subject: 'Chinese',
    dataA: 98,
    dataB: 130,
    fullMark: 150
  },
  {
    subject: 'English',
    dataA: 86,
    dataB: 130,
    fullMark: 150
  },
  {
    subject: 'Geography',
    dataA: 99,
    dataB: 100,
    fullMark: 150
  },
  {
    subject: 'Physics',
    dataA: 85,
    dataB: 90,
    fullMark: 150
  },
  {
    subject: 'History',
    dataA: 65,
    dataB: 85,
    fullMark: 150
  }
];

const data = { data: dataChart, keys: ['A', 'B'] };
