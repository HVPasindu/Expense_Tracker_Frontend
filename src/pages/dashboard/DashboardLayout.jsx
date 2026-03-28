import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Expenses",
      icon: <ReceiptLongIcon />,
      path: "/dashboard/expenses",
    },
    {
      text: "Add Expense",
      icon: <AddCircleOutlineIcon />,
      path: "/dashboard/add-expense",
    },
    {
      text: "Profile",
      icon: <PersonOutlineIcon />,
      path: "/dashboard/profile",
    },
    {
      text: "Logout",
      icon: <LogoutIcon />,
      action: handleLogout,
    },
  ];

  const getPageTitle = () => {
    if (location.pathname === "/dashboard") {
      return "Dashboard";
    }

    if (location.pathname === "/dashboard/expenses") {
      return "Expenses";
    }

    if (location.pathname === "/dashboard/add-expense") {
      return "Add Expense";
    }

    if (location.pathname === "/dashboard/profile") {
      return "Profile";
    }

    if (location.pathname.includes("/dashboard/expenses/edit/")) {
      return "Edit Expense";
    }

    if (location.pathname.includes("/dashboard/expenses/")) {
      return "Expense Details";
    }

    return "Dashboard";
  };

  const pageTitle = getPageTitle();

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #00a6fb 0%, #0077b6 100%)",
        color: "#fff",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Expense Tracker
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

      <List>
        {menuItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  navigate(item.path);
                  setMobileOpen(false);
                }
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                color: "#fff",
                backgroundColor: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f7fbff" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#ffffff",
          color: "#222",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" fontWeight="bold">
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1">{user?.name || "User"}</Typography>
            <Avatar>{user?.name?.charAt(0)?.toUpperCase() || "U"}</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default DashboardLayout;