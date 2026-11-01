import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Box, Button, Card, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { sendAuthRequest } from "../api/api.ts";
import { authActions } from "../store/authSlice.ts";
import { useAppDispatch } from "../store/index.ts";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSignup, setIsSignup] = useState(true);
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (error) setError("");
  };

  const toggleMode = () => {
    setIsSignup((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { user } = await sendAuthRequest(isSignup, inputs);
      dispatch(authActions.login({ userId: user._id, name: user.name, email: user.email }));
      navigate("/diaries");
    } catch (err) {
      const apiMessage = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(apiMessage || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", px: 2, py: { xs: 6, md: 10 } }}>
      <Card sx={{ width: "100%", maxWidth: 420, p: { xs: 3, sm: 4 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5">{isSignup ? "Create an account" : "Welcome back"}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {isSignup ? "Start sharing your travel diaries." : "Log in to your diaries."}
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {isSignup && (
              <TextField
                label="Name"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                autoComplete="name"
                required
                fullWidth
              />
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={inputs.email}
              onChange={handleChange}
              autoComplete="email"
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={inputs.password}
              onChange={handleChange}
              autoComplete={isSignup ? "new-password" : "current-password"}
              helperText={isSignup ? "At least 6 characters" : undefined}
              required
              fullWidth
              slotProps={{ htmlInput: { minLength: 6 } }}
            />

            <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
              {loading ? <CircularProgress size={22} color="inherit" /> : isSignup ? "Sign up" : "Log in"}
            </Button>

            <Button onClick={toggleMode} color="secondary" fullWidth>
              {isSignup ? "Already have an account? Log in" : "New here? Create an account"}
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
};

export default Auth;
