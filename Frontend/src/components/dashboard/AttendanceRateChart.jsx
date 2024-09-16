import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AttendanceRateChart = ({ data }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (selectedUser) {
            data.fetchAttendanceData(selectedUser).then(setChartData);
        } else {
            data.fetchAttendanceData().then(setChartData);
        }
    }, [selectedUser, data]);

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    return (
        <div>
            <FormControl fullWidth>
                <InputLabel>Select User</InputLabel>
                <Select value={selectedUser} onChange={handleUserChange}>
                    <MenuItem value="">All Users</MenuItem>
                    {data.users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalAssignedCourses" stackId="a" fill="#8884d8" name="Total Assigned Courses" />
                    <Bar dataKey="attendedCourses" stackId="a" fill="#82ca9d" name="Attended Courses" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AttendanceRateChart;
