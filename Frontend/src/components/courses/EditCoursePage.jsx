import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import debounce from 'lodash/debounce';

function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [internalInstructors, setInternalInstructors] = useState([]);
  const [externalInstructors, setExternalInstructors] = useState([]);
  const [filter, setFilter] = useState({
    fonction: '',
    localite: '',
    service: '',
    departementDivision: '',
    affectation: '',
    gradeAssimile: '',
    gradeFonction: ''
  });

  useEffect(() => {
    let isMounted = true; // Flag to check if component is still mounted

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users");
        if (isMounted) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Set flag to false when component unmounts
    };
  }, []);
  
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

        // Fetch details for assigned users
        if (courseData.assignedUsers && courseData.assignedUsers.length > 0) {
          const usersDetails = await Promise.all(
            courseData.assignedUsers.map((userId) =>
              axios.get(`http://localhost:5000/users/${userId}`)
            )
          );
          setAssignedUsers(usersDetails.map((response) => response.data));
        }
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
      const response = await axios.get("http://localhost:5000/users");
      setInternalInstructors(response.data);
    } catch (error) {
      console.error("Failed to fetch internal instructors", error);
    }
  };

  const fetchExternalInstructors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setExternalInstructors(response.data);
    } catch (error) {
      console.error("Failed to fetch external instructors", error);
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

  const handleChange = debounce((event, index) => {
    const { name, value } = event.target;
    const updatedTimes = [...course.times];
    if (name === "instructorType") {
      updatedTimes[index] = {
        ...updatedTimes[index],
        instructorType: value,
        instructor: "",
      };
    } else {
      updatedTimes[index][name] = value;
    }
    setCourse((prev) => ({
      ...prev,
      times: updatedTimes,
    }));
  }, 300);

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
    const courseData = {
      ...course,
      assignedUsers: assignedUsers.map((user) => user._id), // Assuming each user object has an _id field
    };

    try {
      await axios.put(`http://localhost:5000/courses/${id}`, courseData);
      console.log("Course updated successfully");
      navigate("/CoursesManagement");
    } catch (error) {
      console.error("Failed to update course", error);
    }
  };

  const checkUserConflicts = async (userId, startTime, endTime) => {
    const response = await axios.post('http://localhost:5000/courses/checkConflicts', { userId, startTime, endTime });
    return response.data.conflicts;
  };

  useEffect(() => {
    const checkAllUsers = async () => {
        const conflicts = await Promise.all(users.map(user => 
            checkUserConflicts(user._id, course.times[0].startTime, course.times[0].endTime)));
        setUsers(users.map((user, index) => ({ ...user, conflict: conflicts[index].length > 0 })));
    };
    checkAllUsers();
  }, [course.times, users]);

  const handleFilterChange = debounce((event, newValue, field) => {
    setFilter((prev) => ({ ...prev, [field]: newValue }));
  }, 300);

  const uniqueOptions = (field) => {
    const unique = new Set(users.map((user) => user[field]));
    return Array.from(unique).map((value) => ({ label: value }));
  };

  const filteredUsers = users.filter(
    (user) =>
      (!filter.fonction || user.FONCTION === filter.fonction?.label) &&
      (!filter.localite || user.Localite === filter.localite?.label) &&
      (!filter.service || user.SERVICE === filter.service?.label) &&
      (!filter.departementDivision ||
        user.DEPARTEMENT_DIVISION === filter.departementDivision?.label) &&
      (!filter.affectation || user.AFFECTATION === filter.affectation?.label) &&
      (!filter.gradeAssimile ||
        user.GRADE_ASSIMILE === filter.gradeAssimile?.label) &&
      (!filter.gradeFonction ||
        user.GRADE_fonction === filter.gradeFonction?.label) &&
      !assignedUsers.some(assignedUser => assignedUser._id === user._id) // Exclude already assigned users
  );

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
                    isOptionEqualToValue={(option, value) => option._id === value._id}
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
          <Grid container spacing={2} style={{ marginBottom: "16px" }}>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("FONCTION")}
                value={filter.fonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "fonction")
                }
                renderInput={(params) => <TextField {...params} label="Function" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("Localite")}
                value={filter.localite}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "localite")
                }
                renderInput={(params) => <TextField {...params} label="Localite" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("SERVICE")}
                value={filter.service}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "service")
                }
                renderInput={(params) => <TextField {...params} label="Service" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("DEPARTEMENT_DIVISION")}
                value={filter.departementDivision}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "departementDivision")
                }
                renderInput={(params) => <TextField {...params} label="Department/Division" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("AFFECTATION")}
                value={filter.affectation}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "affectation")
                }
                renderInput={(params) => <TextField {...params} label="Affectation" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("GRADE_ASSIMILE")}
                value={filter.gradeAssimile}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeAssimile")
                }
                renderInput={(params) => <TextField {...params} label="Grade Assimile" fullWidth />}
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <Autocomplete
                options={uniqueOptions("GRADE_fonction")}
                value={filter.gradeFonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeFonction")
                }
                renderInput={(params) => <TextField {...params} label="Grade Function" fullWidth />}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Autocomplete
              multiple
              options={filteredUsers}
              getOptionLabel={(option) => option.name}
              value={assignedUsers}
              onChange={(event, newValue) => {
                setAssignedUsers(newValue);
              }}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => (
                <li
                  {...props}
                  style={{ color: option.conflict ? "red" : "black" }}
                >
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Users"
                  variant="outlined"
                  fullWidth
                />
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

export default EditCoursePage
