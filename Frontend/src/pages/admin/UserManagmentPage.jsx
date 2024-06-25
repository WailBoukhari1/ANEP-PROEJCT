import * as XLSX from "xlsx";
import AdminLayout from "../../layout/admin/AdminLayout";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImportExportIcon from "@mui/icons-material/ImportExport";
// import FileUploadIcon from "@mui/icons-material/FileUpload";
import useApiAxios from "../../config/axios";

function UserManagement() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useApiAxios.get("users");
        const formattedData = response.data.map((user) => ({
          ...user,
          DATE_NAISSANCE: user.DATE_NAISSANCE
            ? new Date(user.DATE_NAISSANCE)
            : null,
          DATE_RECRUTEMENT: user.DATE_RECRUTEMENT
            ? new Date(user.DATE_RECRUTEMENT)
            : null,
        }));
        setUsers(formattedData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "email", headerName: "Email", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "roles", headerName: "Roles", width: 120 },
    { field: "PPR", headerName: "PPR", width: 100 },
    { field: "CIN", headerName: "CIN", width: 100 },
    {
      field: "DATE_NAISSANCE",
      headerName: "Date of Birth",
      width: 120,
      type: "date",
    },
    { field: "SITUATION", headerName: "Situation", width: 130 },
    { field: "SEXE", headerName: "Sex", width: 100 },
    { field: "SIT_F_AG", headerName: "Financial Situation", width: 180 },
    {
      field: "DATE_RECRUTEMENT",
      headerName: "Date of Recruitment",
      width: 150,
      type: "date",
      valueGetter: (params) => {
        return params.value ? new Date(params.value) : null;
      },
    },
    { field: "GRADE_fonction", headerName: "Grade/Function", width: 150 },
    { field: "AFFECTATION", headerName: "Assignment", width: 150 },
    {
      field: "DEPARTEMENT_DIVISION",
      headerName: "Department/Division",
      width: 180,
    },
    { field: "SERVICE", headerName: "Service", width: 150 },
    { field: "Localite", headerName: "Locality", width: 150 },
    { field: "FONCTION", headerName: "Function", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to={`/EditUser/${params.row._id}/`}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDeleteUser(params.row._id)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
      width: 180,
    },
  ];

  const handleDeleteUser = async (id) => {
    try {
      await useApiAxios.delete(`users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const exportFileName = "users.xlsx";
    XLSX.writeFile(wb, exportFileName);
  };

  // const handleImport = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = e.target.result;
  //     const workbook = XLSX.read(data, { type: "binary" });
  //     const sheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[sheetName];
  //     const json = XLSX.utils.sheet_to_json(worksheet);
  //     setUsers(json);
  //   };
  //   reader.readAsBinaryString(file);
  // };

  return (
    <AdminLayout>
      <Box
        sx={{
          p: 3,
          width: "100%",
          mb: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{ mb: 3, color: "text.primary" }}
        >
          User Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            startIcon={<AddIcon />}
            to="/CreateUser"
            sx={{ textTransform: "none" }}
          >
            Create New User
          </Button>
          {/* <Button
            variant="contained"
            component="label"
            color="info"
            startIcon={<FileUploadIcon />}
            sx={{ textTransform: "none" }}
          >
            Import from Excel
            <input
              type="file"
              hidden
              onChange={handleImport}
              accept=".xlsx,.xls"
            />
          </Button> */}
          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            startIcon={<ImportExportIcon />}
            sx={{ textTransform: "none" }}
          >
            Export to Excel
          </Button>
        </Box>
        <Paper
          sx={{ height: 400, width: "100%", p: 2, boxShadow: theme.shadows[3] }}
        >
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row) => row._id} // This line tells DataGrid to use `_id` as the unique row identifier
            sx={{
              "& .MuiDataGrid-cell:hover": {
                color: theme.palette.primary.main,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export default UserManagement;
