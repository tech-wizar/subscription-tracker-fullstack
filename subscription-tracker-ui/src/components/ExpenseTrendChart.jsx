import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseTrendChart = ({ data }) => {
    // Recharts expects the data in reverse chronological order for a nice visual flow
    const chartData = [...data].reverse();

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                // This makes the chart scrollable if you have more data
                // layout="vertical" 
            >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="totalCost" fill="#8884d8" name="Total Monthly Cost" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ExpenseTrendChart;