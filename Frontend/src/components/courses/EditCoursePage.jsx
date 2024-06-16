import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import axios from "axios";

function EditCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState({
    title: "",
    imageUrl: "",
    offline: "",
    description: "",
    notifyUsers: false,
    hidden: "",
    budget: "",
    notification: [],
    times: [
      {
        startTime: "",
        endTime: "",
        instructorType: "",
        instructor: "",
      },
    ],
    image: null,
  });

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState([]);

  const [internalInstructors, setInternalInstructors] = useState([]);
  const [externalInstructors, setExternalInstructors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/users");
        const coursesResponse = await axios.get(
          "http://localhost:5000/courses/"
        );
        const courseBeingEdited = await axios.get(
          `http://localhost:5000/courses/${id}`
        );

        const usersWithDetails = usersResponse.data.map((user) => {
          const conflicts = coursesResponse.data.filter(
            (course) =>
              course.participants?.includes(user._id) &&
              course.time === courseBeingEdited.data.time
          );
          return {
            ...user,
            conflicts: conflicts.map((conflict) => conflict.title),
          };
        });
        setUsers(usersWithDetails);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) {
      console.error("Course ID is undefined");
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/courses/${id}`);
        const courseData = response.data;

        setCourse((prev) => ({
          ...prev,
          title: courseData.title,
          imageUrl: courseData.imageUrl,
          offline: courseData.offline,
          description: courseData.description,
          notifyUsers: courseData.notifyUsers,
          hidden: courseData.hidden,
          budget: courseData.budget,
          times: courseData.times || [],
        }));
      } catch (error) {
        console.error("Failed to fetch course data", error);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    fetchInternalInstructors();
    fetchExternalInstructors();
  }, []);

  const fetchInternalInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setInternalInstructors(response.data);
    } catch (error) {
      console.error('Failed to fetch internal instructors', error);
    }
  };

  const fetchExternalInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/external-instructors');
      setExternalInstructors(response.data);
    } catch (error) {
      console.error('Failed to fetch external instructors', error);
    }
  };

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
    const updatedTimes = [...course.times];
    if (name === "instructorType") {
      // Reset instructor when type changes
      updatedTimes[index] = { ...updatedTimes[index], instructorType: value, instructor: "" };
    } else {
      updatedTimes[index][name] = value;
    }
    setCourse((prev) => ({
      ...prev,
      times: updatedTimes,
    }));
  };

  const handleInstructorChange = (event, newValue, index) => {
    const updatedTimes = [...course.times];
    updatedTimes[index].instructor = newValue ? newValue.id : "";
    setCourse((prev) => ({
      ...prev,
      times: updatedTimes,
    }));
  };

  const handleAddSession = () => {
    setCourse((prev) => ({
      ...prev,
      times: [
        ...prev.times,
        { startTime: "", endTime: "", instructorType: "", instructor: "" },
      ],
    }));
  };

  const handleDuplicateSession = () => {
    const lastSession = course.times[course.times.length - 1];
    setCourse((prev) => ({
      ...prev,
      times: [...prev.times, { ...lastSession }],
    }));
  };

  const handleRemoveSession = (index) => {
    setCourse((prev) => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/courses/${id}`, course);
      console.log("Course updated successfully");
    } catch (error) {
      console.error("Failed to update course", error);
    }
  };

  const combinedUsers = [...assignedUsers, ...interestedUsers];

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
          {course.imageUrl && (
            <img
              src={course.imageUrl}
              alt="Course"
              style={{ width: "100%", height: "auto" }}
            />
          )}
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
          <Typography variant="h6">times</Typography>
          {course.times?.map((session, index) => (
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
                      <MenuItem value="intern">Internal</MenuItem>
                      <MenuItem value="extern">External</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    options={
                      session.instructorType === "intern"
                        ? internalInstructors
                        : externalInstructors
                    }
                    getOptionLabel={(option) => option.name}
                    value={
                      (session.instructorType === "intern"
                        ? internalInstructors
                        : externalInstructors
                      ).find(
                        (instructor) => instructor._id === session.instructor
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      handleInstructorChange(event, newValue, index)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Instructor Name" />
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Tooltip title="Remove Session">
                  <IconButton onClick={() => handleRemoveSession(index)}>
                    <RemoveCircleOutlineIcon color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate Session">
                  <IconButton onClick={handleDuplicateSession}>
                    <FileCopyIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </Paper>
          ))}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddSession}
          >
            Add Session
          </Button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Typography variant="h6">Assign Users</Typography>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Autocomplete
              multiple
              options={users.filter((user) => !combinedUsers.includes(user))}
              getOptionLabel={(option) =>
                option && option.label ? option.label : ""
              }
              value={assignedUsers}
              onChange={(event, newValue) => {
                setAssignedUsers(newValue);
                setInterestedUsers(
                  interestedUsers.filter((user) => !newValue.includes(user))
                );
              }}
              renderOption={(props, option) => (
                <Tooltip title={option.conflicts.join(", ") || "No conflicts"}>
                  <li
                    {...props}
                    style={{
                      color: option.conflicts.length ? "red" : "inherit",
                    }}
                  >
                    {option.label}
                  </li>
                </Tooltip>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Assign Users" />
              )}
            />
          </FormControl>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <Typography variant="h6">Interested Users</Typography>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Autocomplete
              multiple
              options={users.filter((user) => !combinedUsers.includes(user))}
              getOptionLabel={(option) =>
                option && option.label ? option.label : ""
              }
              value={interestedUsers}
              onChange={(event, newValue) => {
                setInterestedUsers(newValue);
                setAssignedUsers(
                  assignedUsers.filter((user) => !newValue.includes(user))
                );
              }}
              renderOption={(props, option) => (
                <Tooltip title={option.conflicts.join(", ") || "No conflicts"}>
                  <li
                    {...props}
                    style={{
                      color: option.conflicts.length ? "red" : "inherit",
                    }}
                  >
                    {option.label}
                  </li>
                </Tooltip>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Interested Users" />
              )}
            />
          </FormControl>
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "16px" }}
        >
          Save Course
        </Button>
      </form>
    </AdminLayout>
  );
}

EditCoursePage.propTypes = {
  id: PropTypes.string,
};

export default EditCoursePage;