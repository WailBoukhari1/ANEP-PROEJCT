import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PropTypes from "prop-types";
const Navbar = ({ handleDrawerOpen, open, drawerWidth, isMobile }) => {


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
          Tableau de bord administrateur{" "}
        </Typography>
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
