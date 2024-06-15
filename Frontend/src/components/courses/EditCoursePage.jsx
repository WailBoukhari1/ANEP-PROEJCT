import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import AdminLayout from "../../layout/admin/AdminLayout";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const instructors = [
  { label: "John Doe", id: 1 },
  { label: "Jane Smith", id: 2 },
  { label: "Alice Johnson", id: 3 },
  { label: "Bob Brown", id: 4 },
];

const filterOptions = {
  name: ["User 1", "User 2", "User 3"],
  service: ["Service 1", "Service 2", "Service 3"],
  department: ["Department A", "Department B", "Department C"],
  grade: ["Grade X", "Grade Y", "Grade Z"],
};

function EditCoursePage({ courseId }) {
  const [course, setCourse] = useState({
    title: "Advanced React",
    imageUrl: "",
    offline: "online",
    description: "Learn advanced patterns in React",
    notifyUsers: true,
    hidden: "visible",
    budget: "500",
    notification: [],
    sessions: [
      {
        startTime: "2023-10-01T09:00",
        endTime: "2023-10-01T11:00",
        instructorType: "internal",
        instructorName: "John Doe",
      },
    ],
    image: null,
  });

  useEffect(() => {
    setCourse({
      title: "Advanced React",
      imageUrl: "",
      offline: "online",
      description: "Learn advanced patterns in React",
      notifyUsers: true,
      hidden: "visible",
      budget: "500",
      notification: [],
      sessions: [
        {
          startTime: "2023-10-01T09:00",
          endTime: "2023-10-01T11:00",
          instructorType: "internal",
          instructorName: "John Doe",
        },
      ],
      image: null,
    });
  }, [courseId]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setCourse((prev) => ({
        ...prev,
        image: Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    const updatedSessions = [...course.sessions];
    updatedSessions[index][name] = value;
    setCourse((prev) => ({
      ...prev,
      sessions: updatedSessions,
    }));
  };

  const handleAddSession = () => {
    setCourse((prev) => ({
      ...prev,
      sessions: [
        ...prev.sessions,
        { startTime: "", endTime: "", instructorType: "", instructorName: "" },
      ],
    }));
  };

  const handleDuplicateSession = () => {
    const lastSession = course.sessions[course.sessions.length - 1];
    setCourse((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { ...lastSession }],
    }));
  };

  const handleRemoveSession = (index) => {
    setCourse((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Updated course data:", course);
  };

  const users = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    service: `Service ${index % 5}`,
    localite: `Localite ${index % 4}`,
    fonction: `Fonction ${index % 3}`,
    departementDivision: `Department ${index % 4}`,
    affectation: `Affectation ${index % 5}`,
    gradeAssimile: `Grade ${index % 3}`,
    gradeFonction: `GradeF ${index % 2}`,
    codPos: `CP${index % 5}`,
    sitFAg: `Situation ${index % 2}`,
  }));

  const [filters, setFilters] = useState({
    service: "",
    localite: "",
    fonction: "",
    departementDivision: "",
    affectation: "",
    gradeAssimile: "",
    gradeFonction: "",
    codPos: "",
  });

  const filteredUsers = users.filter((user) =>
    Object.entries(filters).every(
      ([key, value]) => !value || user[key].includes(value)
    )
  );

  const [assignedUsers, setAssignedUsers] = useState([]);

  const handleAssignUser = (user) => {
    // Add user to assignedUsers
    setAssignedUsers((prevAssignedUsers) => [...prevAssignedUsers, user]);
    // Update users array to remove the assigned user
    setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
  };

  const handleRemoveUser = (userId) => {
    setAssignedUsers((prev) => prev.filter((user) => user.id !== userId)); // Remove from assigned users
    const userToAddBack = users.find((user) => user.id === userId); // Find the user in the original list
    if (userToAddBack) {
      setFilteredUsers((prev) => [...prev, userToAddBack]); // Add back to filtered users
    }
  };

  const [interestedUsers, setInterestedUsers] = useState([
    { id: 101, name: "User 101" },
    { id: 102, name: "User 102" },
  ]);

  const handleAssignUserFromInterested = (user) => {
    setAssignedUsers((prev) => [...prev, user]);
    setInterestedUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleRejectUser = (userId) => {
    setInterestedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "24px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <TextField
          label="Title"
          name="title"
          value={course.title}
          onChange={(e) =>
            setCourse((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          required
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #ccc",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <input {...getInputProps()} />
          <Paper elevation={0} style={{ padding: "16px" }}>
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>
                Drag &apos;n&apos; drop an image here, or click to select an
                image
              </p>
            )}
          </Paper>
          {course.image && (
            <img
              src={course.image.preview}
              alt="Preview"
              style={{ marginTop: "16px", maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Offline/Online</InputLabel>
          <Select
            name="offline"
            value={course.offline}
            label="Offline/Online"
            onChange={(e) =>
              setCourse((prev) => ({
                ...prev,
                offline: e.target.value,
              }))
            }
            required
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <ReactQuill
            theme="snow"
            value={course.description}
            onChange={(value) =>
              setCourse((prev) => ({
                ...prev,
                description: value,
              }))
            }
          />
        </FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={course.notifyUsers}
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  notifyUsers: e.target.checked,
                }))
              }
            />
          }
          label="Notify Users"
          style={{ marginBottom: "16px" }}
        />
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Visibility</InputLabel>
          <Select
            name="hidden"
            value={course.hidden}
            label="Visibility"
            onChange={(e) =>
              setCourse((prev) => ({
                ...prev,
                hidden: e.target.value,
              }))
            }
            required
          >
            <MenuItem value="visible">Visible</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget"
          name="budget"
          value={course.budget}
          onChange={(e) =>
            setCourse((prev) => ({
              ...prev,
              budget: e.target.value,
            }))
          }
          required
          fullWidth
          type="number"
          style={{ marginBottom: "16px" }}
        />
        <div style={{ marginBottom: "16px" }}>
          <Typography variant="h6">Sessions</Typography>
          {course.sessions.map((session, index) => (
            <Paper
              key={index}
              elevation={1}
              style={{ padding: "16px", marginBottom: "16px" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    value={session.startTime}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    value={session.endTime}
                    onChange={(e) => handleChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Instructor Type</InputLabel>
                    <Select
                      name="instructorType"
                      value={session.instructorType}
                      onChange={(e) => handleChange(e, index)}
                      fullWidth
                    >
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="external">External</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={instructors}
                    getOptionLabel={(option) => option.label}
                    value={
                      instructors.find(
                        (instructor) =>
                          instructor.label === session.instructorName
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      const updatedSessions = [...course.sessions];
                      updatedSessions[index].instructorName = newValue
                        ? newValue.label
                        : "";
                      setCourse((prev) => ({
                        ...prev,
                        sessions: updatedSessions,
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Instructor Name" />
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Tooltip title="Duplicate Session">
                  <IconButton onClick={handleDuplicateSession}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove Session">
                  <IconButton onClick={() => handleRemoveSession(index)}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
          ))}
          <Button
            variant="outlined"
            onClick={handleAddSession}
            startIcon={<AddCircleOutlineIcon />}
            style={{ marginTop: "16px" }}
          >
            Add Session
          </Button>
        </div>
      </form>
      <div>
        <Typography
          variant="h6"
          style={{ marginTop: "24px", marginBottom: "16px" }}
        >
          Filter Users
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: "16px" }}>
          {Object.entries(filterOptions).map(([filterName, filterValues]) => (
            <Grid item xs={12} sm={6} md={3} key={filterName}>
              <FormControl fullWidth>
                <InputLabel>
                  {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                </InputLabel>
                <Select
                  name={filterName}
                  value={filters[filterName]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      [filterName]: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {filterValues.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              variant="h6"
              style={{ marginTop: "24px", marginBottom: "16px" }}
            >
              Filtered Users
            </Typography>
            <Grid container spacing={2}>
              {filteredUsers.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{user.name}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAssignUser(user)}
                        style={{ marginRight: "8px" }}
                      >
                        Assign
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="h6"
              style={{ marginTop: "24px", marginBottom: "16px" }}
            >
              Assigned Users
            </Typography>
            <Grid container spacing={2}>
              {assignedUsers.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{user.name}</Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          style={{ marginTop: "24px", marginBottom: "16px" }}
        >
          Interested Users
        </Typography>
        <Grid container spacing={2}>
          {interestedUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAssignUserFromInterested(user)}
                    style={{ marginRight: "8px" }}
                  >
                    Assign
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRejectUser(user.id)}
                  >
                    Reject
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ padding: "12px", marginTop: "28px" }}
        >
          Edit Course
        </Button>
      </div>
    </AdminLayout>
  );
}

EditCoursePage.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default EditCoursePage;
