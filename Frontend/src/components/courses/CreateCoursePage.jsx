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
const categories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5",
  "Category 6",
  "Category 7",
  "Category 8",
];
function CreateCoursePage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    title: "",
    location:"",
    category: "",
    offline: "",
    description: "",
    hidden: "",
    budget: "",
    times: [
      {
        startTime: "",
        endTime: "",
        instructor: "",
        instructorName: "",
        instructorType: "intern",
        externalInstructorDetails: {
          phone: "",
          position: "",
          cv: null,
        },
      },
    ],
    image: null,
  });

  const [internalInstructors, setInternalInstructors] = useState([]);

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
      } catch (error) {
        console.error("Échec de la récupération des instructeurs:", error);
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
    const { name, value, files } = event.target;
    const updatedTimes = [...course.times];
    if (name === "instructor") {
      updatedTimes[index][name] = newValue ? newValue.id : undefined;
      updatedTimes[index].instructorName = newValue ? newValue.label : "";
    } else if (name === "cv") {
      updatedTimes[index].externalInstructorDetails[name] = files[0]
        ? files[0].name
        : undefined; // Store file name instead of file object
    } else if (name in updatedTimes[index].externalInstructorDetails) {
      updatedTimes[index].externalInstructorDetails[name] = value;
    } else {
      updatedTimes[index][name] = value;
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
          instructor: "",
          instructorName: "",
          externalInstructorDetails: {
            phone: "",
            position: "",
            cv: null,
          },
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
      alert("Veuillez télécharger une image.");
      return;
    }

    if (
      !course.title ||
      !course.offline ||
      !course.hidden ||
      course.budget === "" ||
      !course.location || // Add location validation
      !course.times.length
    ) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    for (const time of course.times) {
      if (!time.startTime || !time.endTime || !time.instructorName) {
        alert(
          "Veuillez remplir tous les créneaux horaires avec l'heure de début, l'heure de fin et le nom de l'instructeur."
        );
        return;
      }
    }

    const formData = new FormData();
    formData.append("image", course.image);

    // Append CV files to formData
    course.times.forEach((session, index) => {
      if (
        session.externalInstructorDetails &&
        session.externalInstructorDetails.cv
      ) {
        formData.append(`cv_${index}`, session.externalInstructorDetails.cv);
      }
    });

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

        // Prepare the course data, removing any empty instructor fields
        const finalCourseData = {
          ...course,
          imageUrl,
          times: course.times.map((session) => ({
            ...session,
            instructor: session.instructor || undefined,
            externalInstructorDetails: {
              ...session.externalInstructorDetails,
              cv: session.externalInstructorDetails.cv
                ? session.externalInstructorDetails.cv.name
                : undefined,
            },
          })),
        };

        const response = await useApiAxios.post("/courses", finalCourseData);

        if (response.status === 201) {
          console.log("Cours créé avec succès!");
          navigate("/CoursesManagement");
        } else {
          alert(`Échec de la création du cours: ${response.status} ${response.data}`);
        }
      } else {
        alert(
          `Échec du téléchargement de l'image: ${imageUploadResponse.status} ${imageUploadResponse.data}`
        );
      }
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      alert("Erreur lors de la création du cours: " + error.message);
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
          label="Titre"
          name="title"
          value={course.title}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          required
        />
                <TextField
          label="Lieu"
          name="location"
          value={course.location}
          onChange={handleInputChange}
          fullWidth
          style={{ marginBottom: "16px" }}
          required
        />
   
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Catégorie</InputLabel>
          <Select
            name="category"
            value={course.category}
            onChange={handleInputChange}
            required
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              <p>Déposez l'image ici...</p>
            ) : (
              <p>
                Glissez-déposez une image ici, ou cliquez pour sélectionner une image
              </p>
            )}
          </Paper>
          {course.image && (
            <img  
              src={course.image.preview}
              alt="Aperçu"
              style={{ marginTop: "16px", maxWidth: "100%", height: "auto" }}
            />
          )}
        </div>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
        <InputLabel>En ligne/Présentiel</InputLabel>
        <Select
            name="offline"
            value={course.offline}
            label="En ligne/Hors ligne/Hybrid"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="online">En ligne</MenuItem>
            <MenuItem value="offline">Présentiel</MenuItem>
            <MenuItem value="hybrid">Hybrid</MenuItem>
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
            required
          />
        </FormControl>
        <FormControl fullWidth style={{ marginBottom: "16px" }}>
          <InputLabel>Visibilité</InputLabel>
          <Select
            name="hidden"
            value={course.hidden}
            label="Visibilité"
            onChange={handleInputChange}
            required
          >
            <MenuItem value="hidden">Caché</MenuItem>
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
          required
        />
        <Typography variant="h6" gutterBottom>
          Planification
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
                  label="Heure de début"
                  name="startTime"
                  type="datetime-local"
                  value={session.startTime}
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Heure de fin"
                  name="endTime"
                  type="datetime-local"
                  value={session.endTime}
                  onChange={(e) => handleSessionChange(e, index)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Type d'instructeur</InputLabel>
                  <Select
                    name="instructorType"
                    value={session.instructorType}
                    onChange={(e) => handleSessionChange(e, index)}
                    required
                  >
                    <MenuItem value="intern" >Interne</MenuItem>
                    <MenuItem value="extern">Externe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                {session.instructorType === "intern" ? (
                  <Autocomplete
                    options={internalInstructors}
                    getOptionLabel={(option) => option.label}
                    value={
                      internalInstructors.find(
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
                      <TextField {...params} label="Nom de l'instructeur" />
                    )}
                    fullWidth
                    required
                  />
                ) : (
                  <>
                    <TextField
                      label="Nom de l'instructeur"
                      name="instructorName"
                      value={session.instructorName}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Téléphone"
                      name="phone"
                      value={session.externalInstructorDetails.phone}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                    <TextField
                      label="Poste"
                      name="position"
                      value={session.externalInstructorDetails.position}
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                    <TextField
                      type="file"
                      name="cv"
                      onChange={(e) => handleSessionChange(e, index)}
                      fullWidth
                      style={{ marginTop: "16px" }}
                      required
                    />
                  </>
                )}
              </Grid>
            </Grid>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Tooltip title="Supprimer la session">
                <IconButton onClick={() => handleRemoveSession(index)}>
                  <RemoveCircleOutlineIcon color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Dupliquer la session">
                <IconButton onClick={() => handleDuplicateSession(index)}>
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
          Ajouter une session
        </Button>
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Créer le cours
        </Button>
      </form>
    </AdminLayout>
  );
}

export default CreateCoursePage;
