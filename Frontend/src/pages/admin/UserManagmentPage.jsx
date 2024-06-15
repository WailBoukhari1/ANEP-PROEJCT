import * as XLSX from "xlsx";
import AdminLayout from "../../layout/admin/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
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
import FileUploadIcon from "@mui/icons-material/FileUpload";

function UserManagement() {
  const theme = useTheme();
  const [users, setUsers] = useState([
    {
      id: 1,
      email: "user1@example.com",
      name: "John Doe",
      roles: ["admin"],
      PPR: 123456,
      CIN: "AB123456",
      DATE_NAISSANCE: new Date(1990, 0, 1),
      SITUATION: "Single",
      SEXE: "Male",
      SIT_F_AG: "Good",
      DATE_RECRUTEMENT: new Date(2020, 0, 10),
      GRADE_fonction: "Manager",
      AFFECTATION: "Headquarters",
      DEPARTEMENT_DIVISION: "HR",
      SERVICE: "Management",
      Localite: "New York",
      FONCTION: "HR Manager",
    },
    {
      id: 2,
      email: "user2@example.com",
      name: "Jane Smith",
      roles: ["user"],
      PPR: 123457,
      CIN: "AB123457",
      DATE_NAISSANCE: new Date(1992, 1, 15),
      SITUATION: "Married",
      SEXE: "Female",
      SIT_F_AG: "Average",
      DATE_RECRUTEMENT: new Date(2021, 5, 20),
      GRADE_fonction: "Developer",
      AFFECTATION: "Remote",
      DEPARTEMENT_DIVISION: "IT",
      SERVICE: "Development",
      Localite: "California",
      FONCTION: "Software Developer",
    },
    {
      id: 3,
      email: "user3@example.com",
      name: "Alice Johnson",
      roles: ["user"],
      PPR: 123458,
      CIN: "AB123458",
      DATE_NAISSANCE: new Date(1988, 2, 22),
      SITUATION: "Divorced",
      SEXE: "Female",
      SIT_F_AG: "Poor",
      DATE_RECRUTEMENT: new Date(2019, 11, 30),
      GRADE_fonction: "Support",
      AFFECTATION: "Branch",
      DEPARTEMENT_DIVISION: "Customer Service",
      SERVICE: "Support",
      Localite: "Texas",
      FONCTION: "Support Specialist",
    },
    {
      id: 4,
      email: "user4@example.com",
      name: "Bob Brown",
      roles: ["user"],
      PPR: 123459,
      CIN: "AB123459",
      DATE_NAISSANCE: new Date(1985, 3, 5),
      SITUATION: "Widowed",
      SEXE: "Male",
      SIT_F_AG: "Excellent",
      DATE_RECRUTEMENT: new Date(2018, 7, 15),
      GRADE_fonction: "Technician",
      AFFECTATION: "Main Office",
      DEPARTEMENT_DIVISION: "Maintenance",
      SERVICE: "Technical",
      Localite: "Florida",
      FONCTION: "Maintenance Technician",
    },
    {
      id: 5,
      email: "user5@example.com",
      name: "Charlie Green",
      roles: ["user"],
      PPR: 123460,
      CIN: "AB123460",
      DATE_NAISSANCE: new Date(1991, 4, 10),
      SITUATION: "Single",
      SEXE: "Male",
      SIT_F_AG: "Fair",
      DATE_RECRUTEMENT: new Date(2022, 2, 5),
      GRADE_fonction: "Clerk",
      AFFECTATION: "Branch",
      DEPARTEMENT_DIVISION: "Administration",
      SERVICE: "Clerical",
      Localite: "Seattle",
      FONCTION: "Administrative Clerk",
    },
    {
      id: 6,
      email: "user6@example.com",
      name: "Diana Red",
      roles: ["user"],
      PPR: 123461,
      CIN: "AB123461",
      DATE_NAISSANCE: new Date(1989, 5, 20),
      SITUATION: "Married",
      SEXE: "Female",
      SIT_F_AG: "Good",
      DATE_RECRUTEMENT: new Date(2017, 8, 25),
      GRADE_fonction: "Salesperson",
      AFFECTATION: "Branch",
      DEPARTEMENT_DIVISION: "Sales",
      SERVICE: "Sales",
      Localite: "Chicago",
      FONCTION: "Sales Representative",
    },
    {
      id: 7,
      email: "user7@example.com",
      name: "Evan Blue",
      roles: ["user"],
      PPR: 123462,
      CIN: "AB123462",
      DATE_NAISSANCE: new Date(1993, 6, 30),
      SITUATION: "Single",
      SEXE: "Male",
      SIT_F_AG: "Excellent",
      DATE_RECRUTEMENT: new Date(2021, 9, 10),
      GRADE_fonction: "Engineer",
      AFFECTATION: "Headquarters",
      DEPARTEMENT_DIVISION: "Engineering",
      SERVICE: "Engineering",
      Localite: "Boston",
      FONCTION: "Systems Engineer",
    },
    {
      id: 8,
      email: "user8@example.com",
      name: "Fiona Yellow",
      roles: ["user"],
      PPR: 123463,
      CIN: "AB123463",
      DATE_NAISSANCE: new Date(1987, 7, 15),
      SITUATION: "Divorced",
      SEXE: "Female",
      SIT_F_AG: "Poor",
      DATE_RECRUTEMENT: new Date(2016, 10, 20),
      GRADE_fonction: "Accountant",
      AFFECTATION: "Main Office",
      DEPARTEMENT_DIVISION: "Finance",
      SERVICE: "Accounting",
      Localite: "San Francisco",
      FONCTION: "Financial Accountant",
    },
    {
      id: 9,
      email: "user9@example.com",
      name: "George White",
      roles: ["user"],
      PPR: 123464,
      CIN: "AB123464",
      DATE_NAISSANCE: new Date(1990, 8, 25),
      SITUATION: "Widowed",
      SEXE: "Male",
      SIT_F_AG: "Average",
      DATE_RECRUTEMENT: new Date(2015, 11, 30),
      GRADE_fonction: "Manager",
      AFFECTATION: "Remote",
      DEPARTEMENT_DIVISION: "Operations",
      SERVICE: "Operations",
      Localite: "Miami",
      FONCTION: "Operations Manager",
    },
    {
      id: 10,
      email: "user10@example.com",
      name: "Helen Black",
      roles: ["user"],
      PPR: 123465,
      CIN: "AB123465",
      DATE_NAISSANCE: new Date(1986, 9, 5),
      SITUATION: "Single",
      SEXE: "Female",
      SIT_F_AG: "Excellent",
      DATE_RECRUTEMENT: new Date(2014, 0, 15),
      GRADE_fonction: "Consultant",
      AFFECTATION: "Headquarters",
      DEPARTEMENT_DIVISION: "Consulting",
      SERVICE: "Consulting",
      Localite: "Denver",
      FONCTION: "Business Consultant",
    },
  ]);

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
      headerName: "Recruitment Date",
      width: 150,
      type: "date",
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
            <IconButton onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
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

  const handleEdit = (user) => {
    console.log("Editing", user);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    console.log("Deleted user with id:", id);
  };

  const handleCreate = () => {
    // Placeholder for create logic
    console.log("Create new user logic here");
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    const exportFileName = "users.xlsx";
    XLSX.writeFile(wb, exportFileName);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setUsers(json);
    };
    reader.readAsBinaryString(file);
  };

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
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{ textTransform: "none" }}
          >
            Create New User
          </Button>
          <Button
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
          </Button>
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
            sx={{
              "& .MuiDataGrid-cell:hover": {
                color: theme.palette.primary.main,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiDataGrid-row": {
                "&:nth-of-type(odd)": {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }}
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
}

export default UserManagement;
