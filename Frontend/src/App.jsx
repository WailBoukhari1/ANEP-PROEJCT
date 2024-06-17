import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./utils/cssLoader.css";
import Aos from "aos";
import "aos/dist/aos";
import LoadingComponent from "./components/LoadingComponent";

// Lazy loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const Course = lazy(() => import("./pages/CoursePage"));
const CoursesDetails = lazy(() => import("./pages/CoursesDetailsPage"));
const Dashboard = lazy(() => import("./pages/admin/DashboardPage"));
const CourseManagmentPage = lazy(() =>
  import("./pages/admin/CourseManagmentPage")
);
const CreateCourse = lazy(() =>
  import("./components/courses/CreateCoursePage")
);
const EditCourse = lazy(() => import("./components/courses/EditCoursePage"));
const CreateUser = lazy(() => import("./components/users/CreateUserPage"));
const EditUser = lazy(() => import("./components/users/EditUserPage"));
const UserManagmentPage = lazy(() => import("./pages/admin/UserManagmentPage"));
const Auth = lazy(() => import("./pages/AuthPage"));
const UserCourses = lazy(() => import("./pages/UserCoursesPage"));

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    Aos.init();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Simulate fetching data
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with actual API call
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Suspense fallback={<LoadingComponent />}>
          {isDataLoaded ? (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Courses" element={<Course />} />
              <Route path="/CoursesDetails/:id" element={<CoursesDetails />} />
              <Route path="/Auth" element={<Auth />} />
              <Route path="/UserCourses" element={<UserCourses />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route
                path="/CoursesManagement"
                element={<CourseManagmentPage />}
              />
              <Route path="/CreateCourse" element={<CreateCourse />} />
              <Route path="/EditCourse/:id" element={<EditCourse />} />
              <Route path="/UsersManagement" element={<UserManagmentPage />} />
              <Route path="/CreateUser" element={<CreateUser />} />
              <Route path="/EditUser/:id" element={<EditUser />} />
            </Routes>
          ) : (
            <LoadingComponent />
          )}
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
