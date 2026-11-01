import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import DiaryForm from "../components/DiaryForm.tsx";
import { createPost } from "../api/api.ts";
import { useAppSelector } from "../store/index.ts";
import type { DiaryFormValues } from "../types/diary.ts";

const Add = () => {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.userId);

  const handleSubmit = async (values: DiaryFormValues) => {
    if (!userId) return;
    await createPost({ ...values, user: userId });
    navigate("/diaries");
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <DiaryForm
        heading="Add a diary"
        subheading="Tell the story of a place you've been."
        submitLabel="Publish"
        onSubmit={handleSubmit}
      />
    </Container>
  );
};

export default Add;
