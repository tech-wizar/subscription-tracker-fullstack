import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material'; // Import Box and Typography for styling

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) { // Don't render label for very small slices
        return null;
    }

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// THIS IS OUR NEW CUSTOM LEGEND COMPONENT
const renderCustomizedLegend = (props) => {
  const { payload } = props;

  return (
    <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {payload.map((entry, index) => (
        // Each legend item is a flex container
        <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '80%' }}>
          {/* The styled box bullet point */}
          <Box sx={{ width: 14, height: 14, backgroundColor: entry.color, mr: 1 }} />
          {/* The legend text (category name only) */}
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {entry.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};


const ExpensePieChart = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.category,
        value: item.totalCost,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="80%" // Adjusted radius slightly to make room for labels
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                {/* We now tell the Legend to use our new custom render function */}
                <Legend content={renderCustomizedLegend} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default ExpensePieChart;