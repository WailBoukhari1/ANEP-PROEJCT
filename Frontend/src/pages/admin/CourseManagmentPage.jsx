import AdminLayout from "../../layout/admin/AdminLayout";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  Button,
  Box,
  Typography,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Notifications from "@mui/icons-material/Notifications";
import People from "@mui/icons-material/People";

const dummyCourses = [
  {
    id: 1,
    title: "Advanced Photography",
    imageUrl: "/assets/images/grid/grid_1.png",
    offline: "offline",
    description: "Learn advanced techniques in photography.",
    notifyUsers: true,
    hidden: "visible",
    budget: 500,
  },
  {
    id: 2,
    title: "Beginner's Yoga",
    imageUrl: "/assets/images/grid/grid_2.png",
    offline: "online",
    description: "Start your journey with yoga.",
    notifyUsers: false,
    hidden: "visible",
    budget: 300,
  },
  {
    id: 3,
    title: "Advanced Coding",
    imageUrl: "/assets/images/grid/grid_3.png",
    offline: "offline",
    description: "Master the art of coding.",
    notifyUsers: true,
    hidden: "hidden",
    budget: 1000,
  },
  {
    id: 4,
    title: "Cooking 101",
    imageUrl: "/assets/images/grid/grid_4.png",
    offline: "online",
    description: "Learn basic cooking skills.",
    notifyUsers: false,
    hidden: "visible",
    budget: 250,
  },
  {
    id: 5,
    title: "Professional Photography",
    imageUrl: "/assets/images/grid/grid_5.png",
    offline: "offline",
    description: "Take your photography skills to a professional level.",
    notifyUsers: true,
    hidden: "hidden",
    budget: 700,
  },
  {
    id: 6,
    title: "Advanced Yoga",
    imageUrl: "/assets/images/grid/grid_6.png",
    offline: "online",
    description: "Deepen your yoga practice.",
    notifyUsers: true,
    hidden: "visible",
    budget: 450,
  },
  {
    id: 7,
    title: "Web Development",
    imageUrl: "/assets/images/grid/grid_7.png",
    offline: "offline",
    description: "Build and deploy web applications.",
    notifyUsers: false,
    hidden: "visible",
    budget: 1200,
  },
  {
    id: 8,
    title: "Digital Marketing",
    imageUrl: "/assets/images/grid/grid_8.png",
    offline: "online",
    description: "Learn the fundamentals of digital marketing.",
    notifyUsers: true,
    hidden: "hidden",
    budget: 500,
  },
  {
    id: 9,
    title: "Advanced Cooking Techniques",
    imageUrl: "/assets/images/grid/grid_9.png",
    offline: "offline",
    description: "Explore advanced culinary techniques.",
    notifyUsers: false,
    hidden: "visible",
    budget: 600,
  },
  {
    id: 10,
    title: "Machine Learning",
    imageUrl: "/assets/images/grid/grid_1.png",
    offline: "online",
    description: "Dive into the world of machine learning.",
    notifyUsers: true,
    hidden: "hidden",
    budget: 1500,
  },
];

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

function CourseManagement() {
  const theme = useTheme();
  const [courses, setCourses] = useState(dummyCourses);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userPresence, setUserPresence] = useState({});

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
    setUserPresence({ 1: "absent", 2: "absent", 3: "absent" });
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

  const handleEdit = (course) => {
    console.log("Editing", course);
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
    console.log("Deleted course with id:", id);
  };

  const handleNotify = (course) => {
    console.log("Notifying users for course:", course.title);
  };

  const columns = [
    { field: "title", headerName: "Course Title", width: 150 },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <img
          loading="lazy"
          src={params.value}
          alt={params.row.title}
          style={{ width: "100%", height: "auto", borderRadius: 4 }}
        />
      ),
    },
    { field: "offline", headerName: "Mode", width: 100 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "notifyUsers", headerName: "Notify Users", width: 100 },
    { field: "hidden", headerName: "Status", width: 100 },
    { field: "budget", headerName: "Budget", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 300,
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
          <Tooltip title="Notify User">
            <IconButton
              onClick={() => handleNotify(params.row)}
              color="default"
            >
              <Notifications />
            </IconButton>
          </Tooltip>
          <Tooltip title="Presence">
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

  const handleCreate = () => {
    const newCourse = {
      id: courses.length + 1,
      title: "New Course",
      instructor: "New Instructor",
    };
    setCourses([...courses, newCourse]);
    console.log("Added new course");
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
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          component="div"
          sx={{ mb: 3, color: "text.primary" }}
        >
          Course Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
            startIcon={<AddIcon />}
            sx={{ textTransform: "none" }}
          >
            Create New Course
          </Button>
        </Box>
        <Paper
          sx={{ height: 400, width: "100%", p: 2, boxShadow: theme.shadows[3] }}
        >
          <DataGrid
            rows={courses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row) => row.id}
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
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${theme.palette.divider}`,
              },
            }}
          />
        </Paper>
      </Box>
      {anchorEl && (
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
PresenceMenu.propTypes = {
  anchorEl: PropTypes.any, // You can specify more specific types based on your usage
  userPresence: PropTypes.object.isRequired,
  handleMenuClose: PropTypes.func.isRequired,
  handlePresenceChange: PropTypes.func.isRequired,
  handleSavePresence: PropTypes.func.isRequired,
};
export default CourseManagement;
