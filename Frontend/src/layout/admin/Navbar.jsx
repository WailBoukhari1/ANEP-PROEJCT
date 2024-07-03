import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PropTypes from "prop-types";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import useApiAxios from "../../config/axios";
import UserContext from "../../auth/user-context";
import {logoutQuery} from "../../auth/user-axios" // Importer la fonction logoutQuery

const socket = io("https://anep-proejct.onrender.com/");

const Navbar = ({ handleDrawerOpen, open, drawerWidth, isMobile }) => {
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
 const [currentUser] = useContext(UserContext);
  const adminId = currentUser._id;
  const navigate = useNavigate();
  const upperCaseName = currentUser.name.toUpperCase();
  useEffect(() => {
    // Register the admin user
    socket.emit("register", adminId);

    // Fetch stored notifications
    const fetchNotifications = () => {
      useApiAxios
        .get(`/users/admin/notifications`)
        .then((response) => {
          const sortedNotifications = response.data.notifications.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setNotifications(sortedNotifications);
        })
        .catch((error) =>
          console.error("Failed to load notifications:", error)
        );
    };

    fetchNotifications();

    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        { ...notification, isNew: true },
        ...prevNotifications,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const handleNotifClick = (event) => {
    setAnchorElNotif(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorElNotif(null);
  };

  const handleUserMenuClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };
  const handleLogout = () => {
    logoutQuery(); // Appeler la fonction logoutQuery pour se déconnecter
  };
  const handleUserProfile =() =>{
    window.location.href = 'UserProfile'
  }

  const handleNotificationClick = (notificationId, courseId) => {
    
     useApiAxios
       .post(`/users/mark-notification-read`, {
         userId: adminId,
         notificationId,
         courseId,
       })
       .then(() => {
         setNotifications(
           notifications.map((notif) =>
             notif._id === notificationId ? { ...notif, isNew: false } : notif
           )
         );
       })
       .catch((error) =>
         console.error("Failed to mark notification as read:", error)
       );
        navigate(`/CoursesDetails/${courseId}`);
  };

  const newNotificationsCount = notifications.filter(
    (notif) => notif.isNew
  ).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#1976d2",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        transition: (theme) =>
          theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(open &&
          !isMobile && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerOpen}
          sx={{ marginRight: 2, ...(open && !isMobile && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        Tableau de bord administrateur        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Notifications" arrow>
            <IconButton color="inherit" onClick={handleNotifClick}>
              <Badge badgeContent={newNotificationsCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            id="notification-menu"
            anchorEl={anchorElNotif}
            open={Boolean(anchorElNotif)}
            onClose={handleNotifClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflowY: "auto",
                maxHeight: "300px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                padding: "10px",
                minWidth: "200px",
              },
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem>No new notifications</MenuItem>
            ) : (
              notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    handleNotificationClick(
                      notification._id,
                      notification.courseId
                    )
                  }
                >
                  {notification.isNew ? <strong>New!</strong> : null}{" "}
                  {notification.message}
                </MenuItem>
              ))
            )}
          </Menu>
          <Tooltip title="User Profile" arrow>
            <IconButton
              color="inherit"
              onClick={handleUserMenuClick}
              sx={{ marginLeft: 2 }}
            >
              <Avatar
  alt={upperCaseName}
  src="/static/images/avatar/1.jpg"
  sx={{
    width: 56,
    height: 56,
    marginBottom: (theme) => theme.spacing(1),
  }}/>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleUserMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                padding: "10px",
                minWidth: "200px",
              },
            }}
          >
            <MenuItem onClick={handleUserProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  handleDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Navbar;
