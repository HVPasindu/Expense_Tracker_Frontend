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

function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const validateOtp = (value) => {
    if (!value.trim()) {
      return "OTP is required";
    }

    if (value.length !== 6) {
      return "OTP must be 6 digits";
    }

    if (!/^\d+$/.test(value)) {
      return "OTP must contain only numbers";
    }

    return "";
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    const otpValidationMessage = validateOtp(otp);
    setOtpError(otpValidationMessage);

    if (otpValidationMessage) {
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/verify-otp`, {
        email: email,
        otp: otp,
      });

      setSuccess(response.data.message || "OTP verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    try {
      setResendLoading(true);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/resend-otp`, {
        email: email,
      });

      setSuccess(response.data.message || "OTP sent again");
    } catch (err) {
      setError(err.response?.data?.message || "Cannot connect to server");
    } finally {
      setResendLoading(false);
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
                Verify OTP
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Enter the OTP sent to your email
              </Typography>

              {email && (
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                  {email}
                </Typography>
              )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            <Box component="form" onSubmit={handleVerifyOtp}>
              <Stack spacing={2.5}>
                <TextField
                  label="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (otpError) {
                      setOtpError("");
                    }
                  }}
                  error={!!otpError}
                  helperText={otpError}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.4 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "VERIFY OTP"}
                </Button>

                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  disabled={resendLoading}
                  onClick={handleResendOtp}
                  sx={{ py: 1.4 }}
                >
                  {resendLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "RESEND OTP"
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

export default VerifyOtpPage;