import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";

import DiaryForm from "../components/DiaryForm.tsx";
import { getPostById, updatePost } from "../api/api.ts";
import { useAppSelector } from "../store/index.ts";
import type { DiaryFormValues, DiaryPost } from "../types/diary.ts";

const DiaryUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);

  const [post, setPost] = useState<DiaryPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid diary ID.");
      setLoading(false);
      return;
    }

    let active = true;
    getPostById(id)
      .then((data) => {
        if (active) setPost(data.post);
      })
      .catch(() => {
        if (active) setError("Could not load this diary.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (values: DiaryFormValues) => {
    if (!id) return;
    await updatePost(id, values);
    navigate("/diaries");
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <CircularProgress size={28} color="inherit" />
      </Box>
    );
  }

  const authorId =
    post && typeof post.user === "object" && post.user !== null ? post.user._id : post?.user;
  const canEdit = Boolean(post) && authorId === userId;

  if (error || !post || !canEdit) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity={error ? "error" : "warning"} sx={{ mb: 3 }}>
          {error || "You can only edit your own diaries."}
        </Alert>
        <Button component={Link} to="/diaries" variant="outlined" color="primary">
          Back to diaries
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <DiaryForm
        heading="Edit diary"
        submitLabel="Save changes"
        initialValues={{
          title: post.title,
          description: post.description,
          image: post.image,
          location: post.location,
          date: post.date ? new Date(post.date).toISOString().split("T")[0] : undefined
        }}
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default DiaryUpdate;
