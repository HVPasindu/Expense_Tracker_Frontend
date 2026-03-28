import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Enter a valid email address";
    }

    return "";
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError("");

    const emailValidationMessage = validateEmail(email);
    setEmailError(emailValidationMessage);

    if (emailValidationMessage) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/users/forgot-password",
        {
          email: email,
        }
      );

      navigate("/verify-reset-otp", {
        state: { email: email },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        backgroundImage: "url('/login-bg.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            backgroundColor: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary" gutterBottom>
                Forgot Password
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Enter your email to receive a reset OTP
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleForgotPassword}>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  error={!!emailError}
                  helperText={emailError}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.4 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "SEND RESET OTP"
                  )}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" textAlign="center">
              Back to{" "}
              <Link
                to="/login"
                style={{ color: "#00a6fb", textDecoration: "none" }}
              >
                Login
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPasswordPage;