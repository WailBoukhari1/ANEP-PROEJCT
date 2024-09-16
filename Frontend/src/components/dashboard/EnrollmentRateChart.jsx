import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const EnrollmentRateChart = ({ data }) => {
    if (!data || !data.total || !data.enrolled) {
        return <div>No data available</div>;
    }

    const chartData = [
        { name: 'Enrolled', value: data.enrolled },
        { name: 'Not Enrolled', value: data.total - data.enrolled },
    ];

    const COLORS = ['#0088FE', '#FF8042'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EnrollmentRateChart;