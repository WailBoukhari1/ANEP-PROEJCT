import { useState, useCallback } from "react";
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
import axios from 'axios';

const instructors = [
  { label: "John Doe", id: 1 },
  { label: "Jane Smith", id: 2 },
  { label: "Alice Johnson", id: 3 },
  { label: "Bob Brown", id: 4 },
];
function CreateCoursePage() {
  const [course, setCourse] = useState({
    title: "",
    offline: "",
    description: "",
    notifyUsers: false,
    hidden: "",
    budget: "",
    notification: [],
    sessions: [
      { startTime: "", endTime: "", instructorType: "", instructorName: "" },
    ],
    image: null,
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/courses', course);
      console.log('Course created:', response.data);
    } catch (error) {
      console.error('Failed to create course:', error);
    }
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
            <MenuItem value="hidden">Hidden</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
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
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <Autocomplete
            multiple
            options={instructors}
            getOptionLabel={(option) => option.label}
            value={course.notification}
            onChange={(event, newValue) =>
              setCourse((prev) => ({
                ...prev,
                notification: newValue,
              }))
            }
            renderInput={(params) => (
              <TextField {...params} label="Notify Specific Instructors" />
            )}
          />
        </FormControl>

        <Typography variant="h6" gutterBottom>
          Sessions
        </Typography>
        {course.sessions.map((session, index) => (
          <Paper
            key={index}
            elevation={1}
            style={{
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "8px",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Time"
                  name="startTime"
                  type="datetime-local"
                  value={session.startTime}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={session.endTime}
                  onChange={(e) => handleChange(e, index)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Instructor Type</InputLabel>
                  <Select
                    name="instructorType"
                    value={session.instructorType}
                    onChange={(e) => handleChange(e, index)}
                  >
                    <MenuItem value="internal">Internal</MenuItem>
                    <MenuItem value="external">External</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={instructors}
                  getOptionLabel={(option) => option.label}
                  value={
                    instructors.find(
                      (instructor) =>
                        instructor.label === session.instructorName
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleChange(
                      {
                        target: {
                          name: "instructorName",
                          value: newValue ? newValue.label : "",
                        },
                      },
                      index
                    )
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Instructor Name" />
                  )}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Tooltip title="Duplicate Session">
                  <IconButton
                    onClick={() => handleDuplicateSession(index)}
                    size="large"
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove Session">
                  <IconButton
                    onClick={() => handleRemoveSession(index)}
                    size="large"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        ))}
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddSession}
          startIcon={<AddCircleOutlineIcon />}
          fullWidth
          style={{ marginBottom: "16px" }}
        >
          Add Session
        </Button>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Create Course
        </Button>
      </form>
    </AdminLayout>
  );
}

CreateCoursePage.propTypes = {
  // Define any prop types if needed
};

export default CreateCoursePage;
