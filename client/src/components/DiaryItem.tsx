import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Tooltip,
  Typography
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import { Link } from "react-router-dom";

import { deletePost } from "../api/api.ts";
import { useAppSelector } from "../store/index.ts";

export interface DiaryItemProps {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  userId?: string;
  name?: string;
  onDeleted?: (id: string) => void;
}

const formatDate = (value?: string): string =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "";

const DiaryItem = ({
  id,
  title,
  description,
  image,
  location,
  date,
  userId,
  name,
  onDeleted
}: DiaryItemProps) => {
  const currentUserId = useAppSelector((state) => state.auth.userId);
  const isOwner = Boolean(currentUserId) && currentUserId === userId;

  const [imageFailed, setImageFailed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePost(id);
      setConfirmOpen(false);
      onDeleted?.(id);
    } catch {
      setConfirmOpen(false);
      setError("Could not delete this diary. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card sx={{ width: "100%" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "text.primary", width: 36, height: 36, fontSize: "0.9rem" }}>
            {(name || "T").charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PlaceOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="subtitle2">{location}</Typography>
          </Box>
        }
        subheader={`${name ? `${name} · ` : ""}${formatDate(date)}`}
      />

      {!image || imageFailed ? (
        <Box
          role="img"
          aria-label="Image unavailable"
          sx={{
            height: 280,
            bgcolor: "#f7f7f7",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            color: "text.secondary"
          }}
        >
          <ImageNotSupportedOutlinedIcon sx={{ fontSize: 32, opacity: 0.6 }} />
          <Typography variant="caption" color="text.secondary">
            Image unavailable
          </Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={image}
          alt={title}
          onError={() => setImageFailed(true)}
          sx={{ display: "block", width: "100%", height: 280, objectFit: "cover" }}
        />
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
          {description}
        </Typography>
      </CardContent>

      {isOwner && (
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2, pt: 0 }}>
          <Tooltip title="Edit">
            <IconButton component={Link} to={`/post/${id}`} aria-label="Edit diary" size="small">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => setConfirmOpen(true)} aria-label="Delete diary" size="small">
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </CardActions>
      )}

      <Dialog open={confirmOpen} onClose={() => !deleting && setConfirmOpen(false)}>
        <DialogTitle>Delete this diary?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            &ldquo;{title}&rdquo; will be permanently removed. This can&apos;t be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} color="secondary" disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(error)} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default DiaryItem;
