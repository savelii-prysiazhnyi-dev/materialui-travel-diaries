import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";
import Auth from "./pages/Auth.tsx";
import Diaries from "./pages/Diaries.tsx";
import Add from "./pages/Add.tsx";
import DiaryUpdate from "./pages/DiaryUpdate.tsx";
import Profile from "./pages/Profile.tsx";
import { useAppSelector } from "./store/index.ts";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diaries" element={<Diaries />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/add"
            element={
              <RequireAuth>
                <Add />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/post/:id"
            element={
              <RequireAuth>
                <DiaryUpdate />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
