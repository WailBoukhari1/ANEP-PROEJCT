import AdminLayout from "../../layout/admin/AdminLayout";
import { Card, CardContent, Typography, Grid } from '@mui/material';

// Dummy data for the cards
const statistics = [
  { title: "Total Users", value: 150 },
  { title: "Sales", value: "$1,200" },
  { title: "Subscribers", value: 300 },
  { title: "Comments", value: 150 }
];

function Dashboard() {
  return (
    <AdminLayout>
      <Grid container spacing={3}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h5" component="h2">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </AdminLayout>
  );
}

export default Dashboard;
