import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Notifications from "@mui/icons-material/Notifications";
import People from "@mui/icons-material/People";
import AdminLayout from "../../layout/admin/AdminLayout";

const PresenceMenu = ({
  anchorEl,
  userPresence,
  handleMenuClose,
  handlePresenceChange,
  handleSavePresence,
}) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          padding: "10px",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
        },
      }}
    >
      {Object.keys(userPresence).map((userId) => (
        <MenuItem key={userId} style={{ justifyContent: "space-between" }}>
          <Typography variant="body1" color="textSecondary">
            User {userId}
          </Typography>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={userPresence[userId] === "present"}
                  onChange={() => handlePresenceChange(userId, "present")}
                />
              }
              label="Present"
              labelPlacement="end"
              style={{ marginRight: 8 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={userPresence[userId] === "absent"}
                  onChange={() => handlePresenceChange(userId, "absent")}
                />
              }
              label="Absent"
              labelPlacement="end"
            />
          </Box>
        </MenuItem>
      ))}
      <MenuItem>
        <Button
          fullWidth
          onClick={handleSavePresence}
          color="primary"
          variant="contained"
          style={{ marginTop: 10 }}
        >
          Save
        </Button>
      </MenuItem>
    </Menu>
  );
};

PresenceMenu.propTypes = {
  anchorEl: PropTypes.any, // You can specify more specific type based on your usage
  userPresence: PropTypes.object.isRequired,
  handleMenuClose: PropTypes.func.isRequired,
  handlePresenceChange: PropTypes.func.isRequired,
  handleSavePresence: PropTypes.func.isRequired,
};

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userPresence, setUserPresence] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

const handleMenuOpen = async (event, course) => {
  setAnchorEl(event.currentTarget);
  setSelectedCourse(course);
  try {
    const response = await axios.get(
      `http://localhost:5000/courses/${course._id}`
    );
    const users = response.data;
    const userPresenceState = users.reduce((acc, user) => {
      acc[user._id] = "absent";
      return acc;
    }, {});
    setUserPresence(userPresenceState);
  } catch (error) {
    console.error("Failed to fetch users for course:", error);
  }
};

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handlePresenceChange = (userId, status) => {
    setUserPresence((prev) => ({ ...prev, [userId]: status }));
  };

  const handleSavePresence = () => {
    console.log(
      "Saving presence for course:",
      selectedCourse.title,
      userPresence
    );
    handleMenuClose();
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleNotify = (course) => {
    console.log("Notifying users for course:", course.title);
  };

  const columns = [
    { field: "title", headerName: "Course Title", width: 150 },
    { field: "offline", headerName: "Mode", width: 100 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "hidden", headerName: "Status", width: 100 },
    { field: "budget", headerName: "Budget", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              component={Link}
              to={`/EditCourse/${params.row._id}`}
              color="primary"
              // target="_blank"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleDelete(params.row._id)}
              color="secondary"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notify User">
            <IconButton onClick={() => handleNotify(params.row)} color="info">
              <Notifications />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage Presence">
            <IconButton
              onClick={(event) => handleMenuOpen(event, params.row)}
              color="default"
            >
              <People />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Paper sx={{ p: 2, margin: "auto", maxWidth: 12000, flexGrow: 1 }}>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Course Management</Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to={`/CreateCourse`}
          >
            Create Course
          </Button>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={courses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row) => row._id} // This line tells DataGrid to use `_id` as the unique row identifier
          />
        </div>
      </Paper>
      {selectedCourse && (
        <PresenceMenu
          anchorEl={anchorEl}
          userPresence={userPresence}
          handleMenuClose={handleMenuClose}
          handlePresenceChange={handlePresenceChange}
          handleSavePresence={handleSavePresence}
        />
      )}
    </AdminLayout>
  );
}

export default CourseManagement;
