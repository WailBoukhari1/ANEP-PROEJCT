import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import "./utils/cssLoader.css";
import Aos from "aos";
import "aos/dist/aos";
import LoadingComponent from "./components/LoadingComponent";
import PrivateRoute from "./config/PrivateRoute";

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
              <Route path="/Auth" element={<Auth />} />
              
              <Route path="/" element={
                <PrivateRoute><HomePage /></PrivateRoute>} />
              <Route path="/Courses" element={
                <PrivateRoute><Course /></PrivateRoute>} />
              <Route path="/CoursesDetails/:id" element={
                <PrivateRoute><CoursesDetails /></PrivateRoute>} />
              <Route path="/Dashboard" element={
                <PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route
                path="/CoursesManagement"
                element={
                <PrivateRoute><CourseManagmentPage /></PrivateRoute>}
              />
              <Route path="/CreateCourse" element={
                <PrivateRoute><CreateCourse /></PrivateRoute>} />
              <Route path="/EditCourse/:id" element={
                <PrivateRoute><EditCourse /></PrivateRoute>} />
              <Route path="/UsersManagement" element={
                <PrivateRoute><UserManagmentPage /></PrivateRoute>} />
              <Route path="/CreateUser" element={
                <PrivateRoute><CreateUser /></PrivateRoute>} />
              <Route path="/EditUser/:id" element={
                <PrivateRoute><EditUser /></PrivateRoute>} />
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
