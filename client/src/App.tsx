import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";
import Auth from "./pages/Auth.tsx";

const App = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
