import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DropoutRateChart = ({ data }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div>No data available</div>;
    }

    const chartData = data.map(item => ({
        ...item,
        dropoutRate: Number(item.dropoutRate.toFixed(2))
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="dropoutRate" fill="#ffc658" name="Taux d'abandon (%)" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DropoutRateChart;