import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const CustomCard = styled(Card)(({ theme }) => ({
  minHeight: 150,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(1),
}));

const CustomCardActions = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
}));

function AdminUserNeeds() {
  const [userNeeds, setUserNeeds] = useState([]);

  useEffect(() => {
    async function fetchUserNeeds() {
      try {
        const response = await useApiAxios.get('/user-needs');
        setUserNeeds(response.data);
      } catch (error) {
        console.error('Error fetching user needs:', error);
      }
    }

    fetchUserNeeds();
  }, []);

  const handleDelete = async (id) => {
    try {
      await useApiAxios.delete(`/user-needs/${id}`);
      setUserNeeds((prevNeeds) => prevNeeds.filter((need) => need._id !== id));
    } catch (error) {
      console.error('Error deleting user need:', error);
    }
  };

  return (
    <AdminLayout>
      <RootContainer>
        <Typography variant="h4" gutterBottom>
          User Needs
        </Typography>
        <Grid container spacing={3}>
          {userNeeds.map((need) => (
            <Grid item key={need._id} xs={12} sm={6} md={4}>
              <CustomCard>
                <CustomCardContent>
                  <Typography variant="body2" color="textSecondary">
                    {need.message}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(need.createdAt).toLocaleString()}
                  </Typography>
                </CustomCardContent>
                <CustomCardActions>
                  <DeleteButton size="small" onClick={() => handleDelete(need._id)}>
                    Delete
                  </DeleteButton>
                </CustomCardActions>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
      </RootContainer>
    </AdminLayout>
  );
}

export default AdminUserNeeds;
