import { useEffect, useState } from 'react';
import AdminLayout from "../../layout/admin/AdminLayout";
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import useApiAxios from '../../config/axios';

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [commentData, setCommentData] = useState([]);

  useEffect(() => {
    // Récupérer les données des utilisateurs
    const fetchUserData = async () => {
      try {
        const response = await useApiAxios.get("/users");
        setUserData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des utilisateurs:", error);
      }
    };

    // Récupérer les données des cours
    const fetchCourseData = async () => {
      try {
        const response = await useApiAxios.get("/courses");
        setCourseData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des cours:", error);
      }
    };

    // Récupérer les données des commentaires
    const fetchCommentData = async () => {
      try {
        const response = await useApiAxios.get("/courses/comments/");
        setCommentData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données des commentaires:", error);
      }
    };

    fetchUserData();
    fetchCourseData();
    fetchCommentData();
  }, []);

  const courseChartData = courseData.map((course) => ({
    name: course.title,
    comments: course.comments ? course.comments.length : 0,
  }));

  const userRolesData = [
    {
      name: "Utilisateur",
      value: userData.filter((user) => user.roles.includes("user")).length,
    },
    {
      name: "Admin",
      value: userData.filter((user) => user.roles.includes("admin")).length,
    },
  ];

  const courseVisibilityData = [
    {
      name: "Visible",
      value: courseData.filter((course) => course.hidden === "visible").length,
    },
    {
      name: "Caché",
      value: courseData.filter((course) => course.hidden === "hidden").length,
    },
  ];

  const commentReportData = [
    {
      name: "Signalé",
      value: commentData.filter((comment) => comment.reported).length,
    },
    {
      name: "Non Signalé",
      value: commentData.filter((comment) => !comment.reported).length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <AdminLayout>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Utilisateurs Totals
              </Typography>
              <Typography variant="h5" component="h2">
                {userData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cours Totals
              </Typography>
              <Typography variant="h5" component="h2">
                {courseData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Commentaires Totals
              </Typography>
              <Typography variant="h5" component="h2">
                {commentData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Commentaires Signalés Totals
              </Typography>
              <Typography variant="h5" component="h2">
                {commentReportData[0].value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Commentaires des Cours
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

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Rôles des Utilisateurs
          </Typography>
          <PieChart width={400} height={400}>
            <Pie
              data={userRolesData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userRolesData.map((entry, index) => (
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
          <Typography variant="h6" gutterBottom>
            Visibilité des Cours
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
          <Typography variant="h6" gutterBottom>
            Statut de Signalement des Commentaires
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
