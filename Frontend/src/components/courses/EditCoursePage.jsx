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
import axios from "axios";
import debounce from "lodash/debounce";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    fonction: null,
    localite: null,
    service: null,
    departementDivision: null,
    affectation: null,
    gradeAssimile: null,
    gradeFonction: null,
  });
  const [allCourses, setAllCourses] = useState([]); // State to store all courses

  useEffect(() => {
    const fetchUsersAndCourse = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:5000/users");
        const courseResponse = await axios.get(
          `http://localhost:5000/courses/${id}`
        );
        const allCoursesResponse = await axios.get(
          "http://localhost:5000/courses"
        );

        setUsers(usersResponse.data);
        setInternalInstructors(usersResponse.data);
        setExternalInstructors(usersResponse.data);
        setAllCourses(allCoursesResponse.data); // Store all courses

        const courseData = courseResponse.data;
        setCourse({
          ...courseData,
          times: courseData.times || [],
          image: courseData.image ? { preview: courseData.imageUrl } : null,
        });

        if (courseData.assignedUsers) {
          const assignedUsersDetails = await Promise.all(
            courseData.assignedUsers.map((userId) =>
              axios.get(`http://localhost:5000/users/${userId}`)
            )
          );
          setAssignedUsers(assignedUsersDetails.map((res) => res.data));
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchUsersAndCourse();
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setCourse((prev) => ({
        ...prev,
        image: Object.assign(file, { preview: URL.createObjectURL(file) }),
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

 const handleChange = (event, index) => {
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
   setCourse((prev) => ({ ...prev, times: updatedTimes }));
 };

  const handleInstructorChange = (event, newValue, index) => {
    const updatedTimes = [...course.times];
    updatedTimes[index].instructor = newValue ? newValue._id : "";
    setCourse((prev) => ({ ...prev, times: updatedTimes }));
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
      assignedUsers: assignedUsers.map((user) => user._id),
    };

    try {
      for (const user of assignedUsers) {
        const conflictCourse = checkConflicts(
          user._id,
          course.times[0].startTime,
          course.times[0].endTime
        );
        if (conflictCourse) {
          await axios.put(
            `http://localhost:5000/courses/${conflictCourse._id}`,
            {
              ...conflictCourse,
              assignedUsers: conflictCourse.assignedUsers.filter(
                (u) => u._id !== user._id
              ),
            }
          );
        }
      }
      await axios.put(`http://localhost:5000/courses/${id}`, courseData);
      console.log("Course updated successfully");
      navigate("/CoursesManagement");
    } catch (error) {
      console.error("Failed to update course", error);
    }
  };

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
      !assignedUsers.some((assignedUser) => assignedUser._id === user._id)
  );

  // Function to check for conflicts
const checkConflicts = (userId, startTime, endTime) => {
  for (const course of allCourses) {
    if (course._id !== id && course.assignedUsers.includes(userId)) {
      // Check at the course level
      for (const time of course.times) {
        if (
          (new Date(startTime) >= new Date(time.startTime) &&
            new Date(startTime) <= new Date(time.endTime)) ||
          (new Date(endTime) >= new Date(time.startTime) &&
            new Date(endTime) <= new Date(time.endTime))
        ) {
          return course;
        }
      }
    }
  }
  return null;
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
          <Typography variant="h6">Session</Typography>
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
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Instructor Name"
                        fullWidth
                      />
                    )}
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
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("FONCTION")}
                value={filter.fonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "fonction")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Function" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("Localite")}
                value={filter.localite}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "localite")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Localite" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("SERVICE")}
                value={filter.service}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "service")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Service" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("DEPARTEMENT_DIVISION")}
                value={filter.departementDivision}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "departementDivision")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department/Division"
                    fullWidth
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("AFFECTATION")}
                value={filter.affectation}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "affectation")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Affectation" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("GRADE_ASSIMILE")}
                value={filter.gradeAssimile}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeAssimile")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Grade Assimile" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <Autocomplete
                options={uniqueOptions("GRADE_fonction")}
                value={filter.gradeFonction}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "gradeFonction")
                }
                renderInput={(params) => (
                  <TextField {...params} label="Grade Function" fullWidth />
                )}
                isOptionEqualToValue={(option, value) =>
                  option.label === value.label
                }
              />
            </Grid>
          </Grid>
          <FormControl fullWidth style={{ marginBottom: "16px" }}>
            <Autocomplete
              multiple
              options={filteredUsers}
              getOptionLabel={(user) => `${user.name}`}
              value={assignedUsers}
              onChange={(event, newValue) => setAssignedUsers(newValue)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderOption={(props, option) => {
                const conflictCourse = checkConflicts(
                  option._id,
                  course.times[0].startTime,
                  course.times[0].endTime
                );
                return (
                  <li
                    {...props}
                    style={{ color: conflictCourse ? "red" : "inherit" }}
                  >
                    {option.name}
                    {conflictCourse && (
                      <span style={{ marginLeft: "10px", color: "red" }}>
                        (Conflict with: {conflictCourse.title})
                      </span>
                    )}
                  </li>
                );
              }}
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

export default EditCoursePage;
