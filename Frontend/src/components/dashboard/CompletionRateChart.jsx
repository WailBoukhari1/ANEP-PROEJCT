import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CompletionRateChart = ({ data }) => {
    console.log('CompletionRateChart data:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
    }

    const chartData = data.map(item => ({
        ...item,
        completionRate: Number(item.completionRate.toFixed(2))
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="completionRate" fill="#8884d8" name="Taux de complétion (%)" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CompletionRateChart;