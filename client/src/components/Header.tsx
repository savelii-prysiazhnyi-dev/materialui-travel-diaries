import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import ModeOfTravelOutlinedIcon from "@mui/icons-material/ModeOfTravelOutlined";
import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/index.ts";

interface NavItem {
  label: string;
  path: string;
}

const guestLinks: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Diaries", path: "/diaries" },
  { label: "Sign in", path: "/auth" }
];

const memberLinks: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Diaries", path: "/diaries" },
  { label: "Profile", path: "/profile" }
];

const Header = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { pathname } = useLocation();

  const links = isLoggedIn ? memberLinks : guestLinks;
  const active = links.some((item) => item.path === pathname) ? pathname : false;

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Box
            component={Link}
            to="/"
            aria-label="Travel Diaries home"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "text.primary",
              textDecoration: "none"
            }}
          >
            <ModeOfTravelOutlinedIcon fontSize="small" />
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Travel Diaries
            </Typography>
          </Box>

          <Tabs
            value={active}
            textColor="primary"
            indicatorColor="primary"
            aria-label="Main navigation"
            sx={{ ml: "auto" }}
          >
            {links.map((item) => (
              <Tab
                key={item.path}
                component={Link}
                to={item.path}
                value={item.path}
                label={item.label}
                sx={{
                  px: 2,
                  color: "text.secondary",
                  "&.Mui-selected": { color: "text.primary", fontWeight: 600 }
                }}
              />
            ))}
          </Tabs>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
