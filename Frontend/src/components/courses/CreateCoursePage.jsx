import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import useApiAxios from "../../config/axios";

function CreateCoursePage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    offline: "",
    description: "",
    notifyUsers: false,
    hidden: "",
    budget: "",
    times: [
      {
        startTime: "",
        endTime: "",
        instructorType: "",
        instructor: "",
        instructorName: "",
      },
    ],
    image: null,
  });

  const [internalInstructors, setInternalInstructors] = useState([]);
  const [externalInstructors, setExternalInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const internalResponse = await useApiAxios.get("/users");
        setInternalInstructors(
          internalResponse.data.map((instructor) => ({
            label: instructor.name,
            id: instructor._id,
          }))
        );
        const externalResponse = await useApiAxios.get("/external-instructors");
        setExternalInstructors(
          externalResponse.data.map((instructor) => ({
            label: instructor.name,
            id: instructor._id,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
      }
    };

    fetchInstructors();
  }, []);

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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSessionChange = (event, index, newValue = null) => {
    const { name } = event.target;
    const updatedTimes = [...course.times];
    if (name === "instructor") {
      updatedTimes[index][name] = newValue ? newValue.id : ""; // Store the ID
      updatedTimes[index].instructorName = newValue ? newValue.label : ""; // Store the name for display
    } else {
      updatedTimes[index][name] = event.target.value;
    }
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
        {
          startTime: "",
          endTime: "",
          instructorType: "",
          instructor: "",
          instructorName: "",
        },
      ],
    }));
  };

  const handleDuplicateSession = (index) => {
    const lastSession = course.times[index];
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

    // Validate required fields
    if (!course.image) {
      alert("Please upload an image.");
      return;
    }

    if (
      !course.title ||
      !course.offline ||
      !course.hidden ||
      course.budget === "" ||
      !course.times.length
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    for (const time of course.times) {
      if (!time.startTime || !time.endTime || !time.instructor) {
        alert(
          "Please fill in all time slots with start time, end time, and instructor."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", course.image);

    try {
      const imageUploadResponse = await useApiAxios.post(
        "/courses/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (imageUploadResponse.status === 200) {
        const imageUrl = imageUploadResponse.data.imageUrl;

        const finalCourseData = {
          ...course,
          imageUrl,
        };

        const response = await useApiAxios.post("/courses", finalCourseData);

        if (response.status === 201) {
          console.log("Course created successfully!");
          navigate("/CoursesManagement");
        } else {
          alert(`Failed to create course: ${response.status} ${response.data}`);
        }
      } else {
        alert(
          `Image upload failed: ${imageUploadResponse.status} ${imageUploadResponse.data}`
        );
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course: " + error.message);
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
          onChange={handleInputChange}
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
            onChange={handleInputChange}
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <ReactQuill
            theme="snow"
            value={course.description || ""}
            onChange={(content) => {
              setCourse((prev) => ({
                ...prev,
                description: content,
              }));
            }}
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
              name="notifyUsers"
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
            onChange={handleInputChange}
          >
            <MenuItem value="hidden">Hidden</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Budget"
          name="budget"
          type="number"
          value={course.budget}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
        />
        <Typography variant="h6" gutterBottom>
          Sessions
        </Typography>
        {course.times.map((session, index) => (
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
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={session.endTime}
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Instructor Type</InputLabel>
                  <Select
                    name="instructorType"
                    value={session.instructorType}
                    onChange={(e) => handleSessionChange(e, index)}
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
                  getOptionLabel={(option) => option.label}
                  value={
                    (session.instructorType === "intern"
                      ? internalInstructors
                      : externalInstructors
                    ).find(
                      (instructor) => instructor.id === session.instructor
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    handleSessionChange(
                      {
                        target: {
                          name: "instructor",
                        },
                      },
                      index,
                      newValue
                    )
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

export default CreateCoursePage;
