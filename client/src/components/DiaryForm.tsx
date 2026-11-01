import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { isAxiosError } from "axios";
import { Link } from "react-router-dom";

import type { DiaryFormValues } from "../types/diary.ts";

export interface DiaryFormProps {
  heading: string;
  subheading?: string;
  submitLabel: string;
  initialValues?: Partial<DiaryFormValues>;
  onSubmit: (values: DiaryFormValues) => Promise<void>;
}

const emptyValues: DiaryFormValues = {
  title: "",
  description: "",
  image: "",
  location: "",
  date: new Date().toISOString().split("T")[0]
};

const DiaryForm = ({ heading, subheading, submitLabel, initialValues, onSubmit }: DiaryFormProps) => {
  const [values, setValues] = useState<DiaryFormValues>({
    ...emptyValues,
    ...initialValues,
    date: initialValues?.date || emptyValues.date
  });
  const [previewFailed, setPreviewFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewFailed(false);
  }, [values.image]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const apiMessage = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(apiMessage || "Could not save your diary. Please try again.");
      setSaving(false);
    }
  };

  const trimmedImage = values.image.trim();

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" component="h1">
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subheading}
            </Typography>
          )}
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={values.description}
          onChange={handleChange}
          multiline
          minRows={4}
          required
          fullWidth
        />
        <TextField
          label="Image URL"
          name="image"
          type="url"
          value={values.image}
          onChange={handleChange}
          required
          fullWidth
        />

        {trimmedImage && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden"
            }}
          >
            {previewFailed ? (
              <Box
                role="img"
                aria-label="Image unavailable"
                sx={{
                  height: 180,
                  bgcolor: "#f7f7f7",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  color: "text.secondary"
                }}
              >
                <ImageNotSupportedOutlinedIcon sx={{ fontSize: 28, opacity: 0.6 }} />
                <Typography variant="caption" color="text.secondary">
                  Image unavailable — fallback placeholder will be used
                </Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={trimmedImage}
                alt="Preview"
                onError={() => setPreviewFailed(true)}
                sx={{ display: "block", width: "100%", height: 180, objectFit: "cover" }}
              />
            )}
          </Box>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
          <TextField
            label="Location"
            name="location"
            value={values.location}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={22} color="inherit" /> : submitLabel}
          </Button>
          <Button component={Link} to="/diaries" color="secondary" disabled={saving}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DiaryForm;
