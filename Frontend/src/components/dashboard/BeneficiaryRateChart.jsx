import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BeneficiaryRateChart = ({ data }) => {
    if (!data || !data.total || !data.beneficiaries) {
        return <div>No data available</div>;
    }

    const beneficiaryRate = (data.beneficiaries / data.total) * 100;
    const chartData = [
        { name: 'Bénéficiaires', value: beneficiaryRate },
        { name: 'Non-Bénéficiaires', value: 100 - beneficiaryRate },
    ];

    const COLORS = ['#00C49F', '#FFBB28'];

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
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default BeneficiaryRateChart;