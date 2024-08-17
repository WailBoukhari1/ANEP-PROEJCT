import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Tooltip as PieTooltip, Cell, ResponsiveContainer as PieContainer } from 'recharts';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";

// Colors for the pie chart
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Dashboard Page Component
const DashboardPage = () => {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    // Fetch bar chart data from the backend
    useApiAxios.get('/statistics/designations-and-interest')
      .then(response => {
        // Check if response.data is an array and set state
        if (Array.isArray(response.data)) {
          setBarData(response.data);
        } else {
          console.error('Invalid data format for bar chart:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching bar chart data:', error);
      });

    // Fetch pie chart data from the backend
    useApiAxios.get('/statistics/presence-distribution')
      .then(response => {
        // Check if response.data is an array and set state
        if (Array.isArray(response.data)) {
          setPieData(response.data);
        } else {
          console.error('Invalid data format for pie chart:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching pie chart data:', error);
      });
  }, []);

  // Default data if undefined or empty
  const defaultBarData = [];
  const defaultPieData = [
    { name: 'Designated Presences', value: 0 },
    { name: 'Non-Designated Presences', value: 0 },
    { name: 'Absences', value: 0 }
  ];

  return (
    <AdminLayout>
      <Grid container spacing={3} padding={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Designations and Interested Participants</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barData.length > 0 ? barData : defaultBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assignedCount" fill="#8884d8" name="Designations" />
                <Bar dataKey="interestedCount" fill="#82ca9d" name="Interested Participants" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Typography variant="h6">Presence Distribution</Typography>
            <PieContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : defaultPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  label
                >
                  {pieData.length > 0 ? pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  )) : defaultPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <PieTooltip />
              </PieChart>
            </PieContainer>
          </Paper>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
