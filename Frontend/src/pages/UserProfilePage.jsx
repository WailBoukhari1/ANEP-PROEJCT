import MainLayout from "../layout/MainLayout";
import { useState, useEffect, useContext } from "react";
import useApiAxios from "../config/axios";
import UserContext from "../auth/user-context";
import { Link } from "react-router-dom";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";

function UserCourses() {
  const [activeTab, setActiveTab] = useState("enCours");
  const [currentUser] = useContext(UserContext);
  const [courses, setCourses] = useState({
    enCours: [],
    terminés: [],
  });
  const baseUrl = "http://localhost:5000";
  const [user, setUser] = useState({
    vacations: [{ start: null, end: null }],
  });
  const [submittedVacations, setSubmittedVacations] = useState([]);

  const handleVacationChange = async (index, field, value) => {
    setUser((prev) => {
      const updatedVacations = [...prev.vacations];
      updatedVacations[index][field] = value;
      return { ...prev, vacations: updatedVacations };
    });
  };

const handleRemoveVacation = (index) => {
  setUser((prev) => ({
    ...prev,
    vacations: prev.vacations.filter((_, i) => i !== index),
  }));
};
  const handleDeleteVacation = async (vacationId, index) => {
    try {
      await useApiAxios.delete(`/users/vacations/${vacationId}`);
      console.log("Vacation deleted successfully");
      // Update the state to remove the vacation from the list
      setSubmittedVacations((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting vacation:", error);
    }
  };
useEffect(() => {
  const fetchVacations = async () => {
    try {
      const response = await useApiAxios.get(
        `/users/${currentUser._id}/vacations`
      );
      setSubmittedVacations(response.data);
    } catch (error) {
      console.error("Error fetching vacations:", error);
    }
  };

  fetchVacations();
}, [currentUser._id]); 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send vacation data to backend
      const response = await useApiAxios.post(`/users/vacations`, {
        userId: currentUser._id,
        vacations: user.vacations.map((vacation) => ({
          start: new Date(vacation.start).toISOString(),
          end: new Date(vacation.end).toISOString(),
        })),
      });

      console.log("Vacations submitted successfully:", response.data);
      setSubmittedVacations(response.data); // Update submitted vacations state
    } catch (error) {
      console.error("Error submitting vacations:", error);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userId = currentUser._id;
        const response = await useApiAxios.get(`/courses/user/${userId}`);
        const fetchedCourses = response.data;

        const ongoingCourses = [];
        const finishedCourses = [];

        const currentDate = new Date();

        fetchedCourses.forEach((course) => {
          if (course.times && course.times.length > 0) {
            const startDate = new Date(course.times[0].startTime);
            const endDate = new Date(course.times[0].endTime);

            if (currentDate >= startDate && currentDate <= endDate) {
              ongoingCourses.push(course);
            } else if (currentDate > endDate) {
              finishedCourses.push(course);
            }
          }
        });

        setCourses({ enCours: ongoingCourses, terminés: finishedCourses });
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [currentUser]);

  return (
    <MainLayout>
      <>
        {/* Section Banner */}
        <section>
          <div className="container-fluid-2 py-5">
            <div className="p-5 md:p-10 rounded-5 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="col-span-1 flex flex-col items-center md:items-start">
                <h5 className="text-xl leading-1.2 mb-5">Bonjour</h5>
                <h2 className="text-2xl leading-1.24 mb-5">
                  {currentUser.name}
                </h2>
              </div>
              <div className="col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <UserInfoRow label="Email" value={currentUser.email} />
                <UserInfoRow label="PPR" value={currentUser.PPR} />
                <UserInfoRow label="CIN" value={currentUser.CIN} />
                <UserInfoRow
                  label="Date of Birth"
                  value={
                    currentUser.DATE_NAISSANCE &&
                    new Date(currentUser.DATE_NAISSANCE).toLocaleDateString()
                  }
                />
                <UserInfoRow label="Situation" value={currentUser.SITUATION} />
                <UserInfoRow label="Sex" value={currentUser.SEXE} />
                <UserInfoRow
                  label="Family Status"
                  value={currentUser.SIT_F_AG}
                />
                <UserInfoRow
                  label="Recruitment Date"
                  value={
                    currentUser.DATE_RECRUTEMENT &&
                    new Date(currentUser.DATE_RECRUTEMENT).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Administrative Seniority"
                  value={
                    currentUser.ANC_ADM &&
                    new Date(currentUser.ANC_ADM).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Position Code"
                  value={currentUser.COD_POS}
                />
                <UserInfoRow
                  label="Position Date"
                  value={
                    currentUser.DAT_POS &&
                    new Date(currentUser.DAT_POS).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Function Grade"
                  value={currentUser.GRADE_fonction}
                />
                <UserInfoRow
                  label="Assimilated Grade"
                  value={currentUser.GRADE_ASSIMILE}
                />
                <UserInfoRow
                  label="Grade Effect Date"
                  value={
                    currentUser.DAT_EFF_GR &&
                    new Date(currentUser.DAT_EFF_GR).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Grade Seniority"
                  value={
                    currentUser.ANC_GRADE &&
                    new Date(currentUser.ANC_GRADE).toLocaleDateString()
                  }
                />
                <UserInfoRow label="Scale" value={currentUser.ECHEL} />
                <UserInfoRow label="Echelon" value={currentUser.ECHELON} />
                <UserInfoRow label="Index" value={currentUser.INDICE} />
                <UserInfoRow
                  label="Echelon Effect Date"
                  value={
                    currentUser.DAT_EFF_ECHLON &&
                    new Date(currentUser.DAT_EFF_ECHLON).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Echelon Seniority"
                  value={
                    currentUser.ANC_ECHLON &&
                    new Date(currentUser.ANC_ECHLON).toLocaleDateString()
                  }
                />
                <UserInfoRow
                  label="Assignment"
                  value={currentUser.AFFECTATION}
                />
                <UserInfoRow
                  label="Department/Division"
                  value={currentUser.DEPARTEMENT_DIVISION}
                />
                <UserInfoRow label="Service" value={currentUser.SERVICE} />
                <UserInfoRow label="Location" value={currentUser.Localite} />
                <UserInfoRow label="Function" value={currentUser.FONCTION} />
                <UserInfoRow
                  label="Subsector Label"
                  value={currentUser.LIBELLE_SST}
                />
                <UserInfoRow
                  label="Subsector Date"
                  value={
                    currentUser.DAT_S_ST &&
                    new Date(currentUser.DAT_S_ST).toLocaleDateString()
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section Dashboard Menu */}
        <section>
          <div className="container-fluid-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-30px pt-30px pb-100px">
              {/* Dashboard Content */}
              <div className="lg:col-start-12 lg:col-span-9">
                {/* Courses Section */}
                <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
                  {/* Header */}
                  <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
                    <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      Course Status
                    </h2>
                  </div>
                  <div className="tab">
                    <div className="tab-links flex flex-wrap mb-10px lg:mb-50px rounded gap-10px">
                      <button
                        className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                          activeTab === "enCours"
                            ? "bg-primaryColor text-white"
                            : ""
                        }`}
                        onClick={() => setActiveTab("enCours")}
                      >
                        In Progress
                      </button>
                      <button
                        className={`relative py-10px px-5 md:py-15px lg:px-10 font-bold uppercase text-sm lg:text-base text-blackColor shadow-overview-button dark:bg-whiteColor-dark dark:text-blackColor-dark before:w-0 before:h-0.5 before:absolute before:-bottom-0.5 lg:before:bottom-0 before:left-0 before:bg-primaryColor hover:before:w-full before:transition-all before:duration-300 whitespace-nowrap ${
                          activeTab === "terminés"
                            ? "bg-primaryColor text-white"
                            : ""
                        }`}
                        onClick={() => setActiveTab("terminés")}
                      >
                        Completed
                      </button>
                    </div>
                    <div className="tab-contents">
                      <div className="transition-all duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-30px">
                          {courses[activeTab].map((course) => (
                            <div key={course.id} className="group">
                              {/* Card */}
                              <div
                                className="tab-content-wrapper"
                                data-aos="fade-up"
                              >
                                <div className="p-15px bg-whiteColor shadow-brand dark:bg-darkdeep3-dark dark:shadow-brand-dark">
                                  {/* Card Image */}
                                  <div className="relative mb-4">
                                    <Link
                                      to={`/courseDetails/${course._id}`}
                                      className="w-full overflow-hidden rounded"
                                    >
                                      {/* Your Course Card */}
                                    </Link>
                                  </div>
                                  {/* Course Information */}
                                  <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-blackColor dark:text-blackColor-dark">
                                      {course.name}
                                    </h3>
                                    <span
                                      className={`${
                                        activeTab === "enCours"
                                          ? "text-primaryColor"
                                          : "text-green-500"
                                      }`}
                                    >
                                      {activeTab === "enCours"
                                        ? "In Progress"
                                        : "Completed"}
                                    </span>
                                  </div>
                                  {/* Course Details */}
                                  <div className="mt-2 flex justify-between items-center">
                                    <p className="text-sm text-gray-500">
                                      Start Date:{" "}
                                      {new Date(
                                        course.times[0].startTime
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      End Date:{" "}
                                      {new Date(
                                        course.times[0].endTime
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vacations Section */}
                <div className="p-10px md:px-10 md:py-50px mb-30px bg-whiteColor dark:bg-whiteColor-dark shadow-accordion dark:shadow-accordion-dark rounded-5">
                  {/* Header */}
                  <div className="mb-6 pb-5 border-b-2 border-borderColor dark:border-borderColor-dark">
                    <h2 className="text-2xl font-bold text-blackColor dark:text-blackColor-dark">
                      Vacations
                    </h2>
                  </div>
                  {/* Vacation List */}
                  <form onSubmit={handleSubmit}>
                    {user.vacations.map((vacation, index) => (
                      <Paper
                        key={index}
                        elevation={3}
                        className="p-4 mb-4 flex justify-between items-center"
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Start Date"
                              type="date"
                              value={vacation.start || ""}
                              onChange={(e) =>
                                handleVacationChange(
                                  index,
                                  "start",
                                  e.target.value
                                )
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="End Date"
                              type="date"
                              value={vacation.end || ""}
                              onChange={(e) =>
                                handleVacationChange(
                                  index,
                                  "end",
                                  e.target.value
                                )
                              }
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              required
                            />
                          </Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveVacation(index)}
                        >
                          Remove
                        </Button>
                      </Paper>
                    ))}
                    {/* Add Vacation Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        setUser((prev) => ({
                          ...prev,
                          vacations: [
                            ...prev.vacations,
                            { start: null, end: null },
                          ],
                        }))
                      }
                    >
                      Add Vacation
                    </Button>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mt-3"
                    >
                      Submit Vacations
                    </Button>
                  </form>

                  {/* Display Submitted Vacations */}
                  {/* Display Submitted Vacations */}
                  {submittedVacations.length > 0 && (
                    <div className="mt-5">
                      <Typography variant="h5" gutterBottom>
                        Submitted Vacations:
                      </Typography>
                      {submittedVacations.map((vacation, index) => (
                        <Paper
                          key={index}
                          elevation={3}
                          className="p-4 mb-4 flex justify-between items-center"
                        >
                          <div>
                            <Typography>
                              Start Date:{" "}
                              {new Date(vacation.start).toLocaleDateString()}
                            </Typography>
                            <Typography>
                              End Date:{" "}
                              {new Date(vacation.end).toLocaleDateString()}
                            </Typography>
                          </div>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              handleDeleteVacation(vacation._id, index)
                            }
                          >
                            Delete
                          </Button>
                        </Paper>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </MainLayout>
  );
}

// Component for displaying user information rows
const UserInfoRow = ({ label, value }) => (
  <p className="text-lg">
    <strong>{label}:</strong> {value}
  </p>
);

export default UserCourses;
  