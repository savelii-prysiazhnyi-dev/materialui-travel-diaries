import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Stack, Typography } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from "react-router-dom";

import DiaryItem from "../components/DiaryItem.tsx";
import { getAllPosts } from "../api/api.ts";
import { useAppSelector } from "../store/index.ts";
import type { DiaryPost } from "../types/diary.ts";

const Diaries = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAllPosts()
      .then((data) => {
        if (active) setPosts(data.posts || []);
      })
      .catch(() => {
        if (active) {
          setError("Could not load diaries. Please make sure the server is running.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleDeleted = (id: string) => setPosts((prev) => prev.filter((post) => post._id !== id));

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}
      >
        <Typography variant="h4" component="h1">
          Diaries
        </Typography>
        <Button
          component={Link}
          to={isLoggedIn ? "/add" : "/auth"}
          variant="contained"
          startIcon={<AddOutlinedIcon />}
        >
          New diary
        </Button>
      </Stack>

      {loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress size={28} color="inherit" />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && posts.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2
          }}
        >
          <Typography color="text.secondary" sx={{ mb: 2.5 }}>
            No diaries yet. Be the first to share a story.
          </Typography>
          <Button
            component={Link}
            to={isLoggedIn ? "/add" : "/auth"}
            variant="outlined"
            color="primary"
          >
            {isLoggedIn ? "Write your first diary" : "Sign in to share"}
          </Button>
        </Box>
      )}

      <Stack spacing={4}>
        {posts.map((post) => {
          const author = typeof post.user === "object" && post.user !== null ? post.user : undefined;
          return (
            <DiaryItem
              key={post._id}
              id={post._id}
              title={post.title}
              description={post.description}
              image={post.image}
              location={post.location}
              date={post.date}
              userId={author?._id}
              name={author?.name}
              onDeleted={handleDeleted}
            />
          );
        })}
      </Stack>
    </Container>
  );
};

export default Diaries;
