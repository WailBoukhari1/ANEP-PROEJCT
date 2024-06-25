import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate } from "react-router-dom";

import AdminLayout from "../../layout/admin/AdminLayout";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import useApiAxios from "../../config/axios";

const rolesOptions = ["user", "admin"];

const EditUser = () => {
  const { id } = useParams(); // Using useParams to get the id from the URL
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await useApiAxios.get(
          `/users/${id}`
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (id) {
      // Ensure id is not undefined
      fetchUserData();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? value === "on" : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await useApiAxios.put(
        `/users/${id}`,
        user
      );
      console.log("User updated:", response.data); 
      navigate("/UsersManagement");
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  if (!user) {
    return <div>.</div>;
  }
  return (
    <AdminLayout>
      <Paper
        elevation={3}
        style={{ padding: "24px", maxWidth: "10000px", margin: "auto" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Roles</InputLabel>
                <Select
                  name="roles"
                  multiple
                  value={user.roles || []}
                  onChange={handleChange}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {rolesOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Name"
                name="name"
                value={user.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PPR"
                name="PPR"
                value={user.PPR}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CIN"
                name="CIN"
                value={user.CIN}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Birth"
                type="date"
                name="DATE_NAISSANCE"
                value={user.DATE_NAISSANCE || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Situation"
                name="SITUATION"
                value={user.SITUATION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sex"
                name="SEXE"
                value={user.SEXE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SIT_F_AG"
                name="SIT_F_AG"
                value={user.SIT_F_AG}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Recruitment"
                type="date"
                name="DATE_RECRUTEMENT"
                value={user.DATE_RECRUTEMENT || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="ANC_ADM"
                name="ANC_ADM"
                type="date"
                value={user.ANC_ADM || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Postal Code"
                name="COD_POS"
                value={user.COD_POS}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of Position"
                type="date"
                name="DAT_POS"
                value={user.DAT_POS || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Grade Function"
                name="GRADE_fonction"
                value={user.GRADE_fonction}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Assimilated Grade"
                name="GRADE_ASSIMILE"
                value={user.GRADE_ASSIMILE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Effective Date of Grade"
                type="date"
                name="DAT_EFF_GR"
                value={user.DAT_EFF_GR || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ancient Grade"
                name="ANC_GRADE"
                value={user.ANC_GRADE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Echelon"
                name="ECHEL"
                value={user.ECHEL}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Echelon Assimilated"
                name="ECHELON"
                value={user.ECHELON}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Index"
                name="INDICE"
                value={user.INDICE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Effective Date of Echelon"
                type="date"
                name="DAT_EFF_ECHLON"
                value={user.DAT_EFF_ECHLON || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Ancient Echelon"
                name="ANC_ECHLON"
                value={user.ANC_ECHLON}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Affectation"
                name="AFFECTATION"
                value={user.AFFECTATION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Department Division"
                name="DEPARTEMENT_DIVISION"
                value={user.DEPARTEMENT_DIVISION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Service"
                name="SERVICE"
                value={user.SERVICE}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Location"
                name="Localite"
                value={user.Localite}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Function"
                name="FONCTION"
                value={user.FONCTION}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="SST Label"
                name="LIBELLE_SST"
                value={user.LIBELLE_SST}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date of SST"
                type="date"
                name="DAT_S_ST"
                value={user.DAT_S_ST || ""}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "16px" }}
              >
                Update User
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </AdminLayout>
  );
};

EditUser.propTypes = {
  id: PropTypes.string.isRequired,
};

export default EditUser;
