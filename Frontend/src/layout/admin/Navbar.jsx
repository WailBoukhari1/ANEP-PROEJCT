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
import NotificationsIcon from "@mui/icons-material/Notifications";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
const socket = io("http://localhost:5000");

const Navbar = ({ handleDrawerOpen, open, drawerWidth, isMobile }) => {
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Register the admin user
    const adminId = "6671ba1141116692e9f8a1be";
    socket.emit("register", adminId);

    // Fetch stored notifications
    axios
      .get(`http://localhost:5000/users/admin/notifications`)
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => console.error("Failed to load notifications:", error));

    socket.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
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

  const handleNotificationClick = (courseId) => {
    window.location.href = `/courses/${courseId}`;
  };

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
          Admin Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Notifications" arrow>
            <IconButton color="inherit" onClick={handleNotifClick}>
              <Badge badgeContent={notifications.length} color="secondary">
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
                  onClick={() => handleNotificationClick(notification.courseId)}
                >
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
              <Avatar alt="User Name" src="/static/images/avatar/1.jpg" />
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
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
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
