import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/index.ts";

const Home = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: { xs: "52vh", md: "62vh" },
          backgroundImage: "url(/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 0, 0, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 3
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: "#ffffff",
              textAlign: "center",
              maxWidth: 760,
              fontSize: { xs: "1.9rem", md: "3rem" }
            }}
          >
            Dare to live the life you&apos;ve always wanted
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ textAlign: "center", py: { xs: 6, md: 8 } }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.14em" }}>
          Share your travel diaries with us
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, mb: 4 }}>
          Every journey deserves a story.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "center", alignItems: "center" }}
        >
          <Button
            component={Link}
            to={isLoggedIn ? "/add" : "/auth"}
            variant="outlined"
            color="primary"
          >
            Share Your Story
          </Button>
          <Button component={Link} to="/diaries" variant="contained">
            View Diaries
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Home;
