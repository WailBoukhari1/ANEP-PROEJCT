import React, { useEffect, useState } from 'react';
import AdminLayout from "../../layout/admin/AdminLayout";
import { Card, CardContent, Typography, Grid, makeStyles } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import useApiAxios from '../../config/axios';

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
  },
  cardContent: {
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: theme.spacing(3),
  },
  chartTitle: {
    marginBottom: theme.spacing(2),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await useApiAxios.get("/users");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch course data
    const fetchCourseData = async () => {
      try {
        const response = await useApiAxios.get("/courses");
        setCourseData(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    // Fetch comment data
    const fetchCommentData = async () => {
      try {
        const response = await useApiAxios.get("/courses/comments");
        setCommentData(response.data);
      } catch (error) {
        console.error("Error fetching comment data:", error);
      }
    };

    fetchUserData();
    fetchCourseData();
    fetchCommentData();
  }, []);

  // Prepare data for charts
  const courseChartData = courseData.map((course) => ({
    name: course.title,
    comments: course.comments ? course.comments.length : 0,
  }));

  const courseVisibilityData = [
    {
      name: "Visible",
      value: courseData.filter((course) => course.hidden === "visible").length,
    },
    {
      name: "Hidden",
      value: courseData.filter((course) => course.hidden === "hidden").length,
    },
  ];

  const commentReportData = [
    {
      name: "Reported",
      value: commentData.filter((comment) => comment.reported).length,
    },
    {
      name: "Not Reported",
      value: commentData.filter((comment) => !comment.reported).length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <AdminLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5" component="h2">
                {userData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" gutterBottom>
                Total Courses
              </Typography>
              <Typography variant="h5" component="h2">
                {courseData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" gutterBottom>
                Total Comments
              </Typography>
              <Typography variant="h5" component="h2">
                {commentData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography color="textSecondary" gutterBottom>
                Total Reported Comments
              </Typography>
              <Typography variant="h5" component="h2">
                {commentReportData[0].value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.chartContainer}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom className={classes.chartTitle}>
            Course Comments
          </Typography>
          <BarChart width={500} height={300} data={courseChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="comments" fill="#82ca9d" />
          </BarChart>
        </Grid>
      </Grid>

      <Grid container spacing={3} className={classes.chartContainer}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom className={classes.chartTitle}>
            Course Visibility
          </Typography>
          <PieChart width={400} height={400}>
            <Pie
              data={courseVisibilityData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {courseVisibilityData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom className={classes.chartTitle}>
            Comment Reporting Status
          </Typography>
          <PieChart width={400} height={400}>
            <Pie
              data={commentReportData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {commentReportData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default Dashboard;
