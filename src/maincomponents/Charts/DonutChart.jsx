import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import React from 'react';

const COLORS = ['#4f46e5', '#10b981', '#f43f5e', '#facc15', '#3b82f6']; // example colors

function DonutChart({ data, dataKey = 'value', nameKey = 'name' }) {
  console.log(data);
  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx='50%'
          cy='50%'
          innerRadius={70} // makes it a donut
          outerRadius={100}
          paddingAngle={3}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const percent = props.payload.percentage;
            return `${value} (${percent}%)`;
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DonutChart;
