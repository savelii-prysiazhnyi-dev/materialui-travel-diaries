import { createTheme } from "@mui/material/styles";

const ink = "#111111";
const line = "#e6e6e6";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: ink, contrastText: "#ffffff" },
    secondary: { main: "#6b6b6b" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: ink, secondary: "#6b6b6b" },
    divider: line
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    h3: { fontWeight: 600, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 }
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8, padding: "7px 18px" } }
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } }
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { borderColor: line } }
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: { backgroundColor: "#ffffff", borderBottom: `1px solid ${line}` }
      }
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 500, minWidth: 0 } }
    },
    MuiTabs: {
      styleOverrides: { indicator: { height: 2 } }
    },
    MuiOutlinedInput: {
      styleOverrides: { notchedOutline: { borderColor: line } }
    }
  }
});
