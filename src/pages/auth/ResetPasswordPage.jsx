import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateNewPassword = (value) => {
    if (!value.trim()) {
      return "New password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
    if (!confirmPasswordValue.trim()) {
      return "Confirm password is required";
    }

    if (passwordValue !== confirmPasswordValue) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email not found. Please try again.");
      return;
    }

    const newPasswordValidationMessage = validateNewPassword(newPassword);
    const confirmPasswordValidationMessage = validateConfirmPassword(
      newPassword,
      confirmPassword
    );

    setNewPasswordError(newPasswordValidationMessage);
    setConfirmPasswordError(confirmPasswordValidationMessage);

    if (newPasswordValidationMessage || confirmPasswordValidationMessage) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/users/reset-password",
        {
          email: email,
          new_password: newPassword,
        }
      );

      setSuccess(response.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
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
                Reset Password
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Enter your new password
              </Typography>

              {email && (
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                  {email}
                </Typography>
              )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box component="form" onSubmit={handleResetPassword}>
              <Stack spacing={2.5}>
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (newPasswordError) {
                      setNewPasswordError("");
                    }
                  }}
                  error={!!newPasswordError}
                  helperText={newPasswordError}
                  fullWidth
                />

                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmPasswordError) {
                      setConfirmPasswordError("");
                    }
                  }}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
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
                    "RESET PASSWORD"
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

export default ResetPasswordPage;