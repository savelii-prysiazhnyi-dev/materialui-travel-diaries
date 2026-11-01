import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Divider, Stack, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import DiaryItem from "../components/DiaryItem.tsx";
import { getUserDetails } from "../api/api.ts";
import { authActions } from "../store/authSlice.ts";
import { useAppDispatch, useAppSelector } from "../store/index.ts";
import type { UserProfile } from "../types/diary.ts";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let active = true;
    getUserDetails(userId)
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) setError("Could not load your profile. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate("/");
  };

  const handleDeleted = (id: string) =>
    setUser((prev) =>
      prev ? { ...prev, posts: prev.posts.filter((post) => post._id !== id) } : prev
    );

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress size={28} color="inherit" />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">{error || "Profile not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {user.email}
          </Typography>
        </Box>
        <Button onClick={handleLogout} variant="outlined" color="primary">
          Log out
        </Button>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" sx={{ mb: 3 }}>
        Your diaries ({user.posts.length})
      </Typography>

      {user.posts.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven&apos;t shared any diaries yet.
          </Typography>
          <Button component={Link} to="/add" variant="contained">
            Add your first diary
          </Button>
        </Box>
      ) : (
        <Stack spacing={4}>
          {user.posts.map((post) => (
            <DiaryItem
              key={post._id}
              id={post._id}
              title={post.title}
              description={post.description}
              image={post.image}
              location={post.location}
              date={post.date}
              userId={user._id}
              name={user.name}
              onDeleted={handleDeleted}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Profile;
