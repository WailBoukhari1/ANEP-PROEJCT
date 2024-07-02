import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import useApiAxios from "../../config/axios";
import AdminLayout from "../../layout/admin/AdminLayout";

const RootContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const CustomCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const CustomCardContent = styled(CardContent)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  flexGrow: 1,
}));

const CustomCardActions = styled(CardActions)(({ theme }) => ({
  justifyContent: 'flex-end',
}));

const DeleteButton = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
}));

function AdminUserNeeds() {
  const [userNeeds, setUserNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNeedId, setSelectedNeedId] = useState(null);

  useEffect(() => {
    async function fetchUserNeeds() {
      try {
        const response = await useApiAxios.get('/user-needs');
        setUserNeeds(response.data);
      } catch (error) {
        console.error('Error fetching user needs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserNeeds();
  }, []);

  const handleDelete = async () => {
    try {
      await useApiAxios.delete(`/user-needs/${selectedNeedId}`);
      setUserNeeds((prevNeeds) => prevNeeds.filter((need) => need._id !== selectedNeedId));
    } catch (error) {
      console.error('Error deleting user need:', error);
    } finally {
      setOpenDialog(false);
      setSelectedNeedId(null);
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedNeedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNeedId(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <RootContainer>
          <CircularProgress />
        </RootContainer>
      </AdminLayout>
    );
  }

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
                  <Typography variant="body1" gutterBottom>
                    {need.message}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(need.createdAt).toLocaleString()}
                  </Typography>
                </CustomCardContent>
                <CustomCardActions>
                  <DeleteButton size="small" onClick={() => handleOpenDialog(need._id)}>
                    Delete
                  </DeleteButton>
                </CustomCardActions>
              </CustomCard>
            </Grid>
          ))}
        </Grid>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this user need?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </RootContainer>
    </AdminLayout>
  );
}

export default AdminUserNeeds;
