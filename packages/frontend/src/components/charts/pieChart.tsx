import { useState } from 'react';
import { Cell, Pie, PieChart as PieChartRe, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { fillColors } from './helpers/colors';

interface PieChartBasicProps {
  data?: {
    notStarted: number;
    inProgress: number;
    completed: number;
    total: number;
  };
}

interface PieChartEnhancedProps {
  data?: {
    notStarted: number;
    inProgress: number;
    completed: number;
    total: number;
  };
}

export function PieChartBasic({ data }: PieChartBasicProps) {
  const chartData = data
    ? [
        { name: 'Not Started', value: data.notStarted },
        { name: 'In Progress', value: data.inProgress },
        { name: 'Completed', value: data.completed }
      ]
    : [];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChartRe width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={fillColors[index % fillColors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChartRe>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChartEnhanced({ data }: PieChartEnhancedProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const chartData = data
    ? [
        { name: 'Not Started', value: data.notStarted },
        { name: 'In Progress', value: data.inProgress },
        { name: 'Completed', value: data.completed }
      ]
    : [];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChartRe width={400} height={400}>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={fillColors[index % fillColors.length]} />
            ))}
          </Pie>
        </PieChartRe>
      </ResponsiveContainer>
    </div>
  );
}

const renderActiveShape = props => {
  const radian = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-radian * midAngle);
  const cos = Math.cos(-radian * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value} tasks`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};
