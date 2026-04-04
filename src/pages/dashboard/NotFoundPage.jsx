import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: "linear-gradient(135deg, #e3f2fd 0%, #f8fbff 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 5,
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(25, 118, 210, 0.08)",
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                color: "white",
                boxShadow: "0 10px 24px rgba(25, 118, 210, 0.28)",
              }}
            >
              <ErrorOutlineRoundedIcon sx={{ fontSize: 42 }} />
            </Box>

            <Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "4rem", sm: "5.5rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                  color: "primary.main",
                }}
              >
                404
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Page not found
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mt: 1.5,
                  maxWidth: 420,
                  mx: "auto",
                }}
              >
                Sorry, the page you are looking for does not exist, was moved,
                or the URL is incorrect.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%", justifyContent: "center", pt: 1 }}
            >
            

              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => window.history.back()}
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: 3,
                  minWidth: 180,
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default NotFoundPage;