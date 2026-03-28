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

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) {
      return "Name is required";
    }

    if (value.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    return "";
  };

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

  const validatePhoneNumber = (value) => {
    if (!value.trim()) {
      return "Phone number is required";
    }

    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;

    if (!phoneRegex.test(value)) {
      return "Enter a valid phone number";
    }

    return "";
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      return "Password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
    if (!confirmPasswordValue.trim()) {
      return "Confirm Password is required";
    }

    if (passwordValue !== confirmPasswordValue) {
      return "Passwords do not match";
    }

    return "";
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");

    const nameValidationMessage = validateName(name);
    const emailValidationMessage = validateEmail(email);
    const phoneNumberValidationMessage = validatePhoneNumber(phoneNumber);
    const passwordValidationMessage = validatePassword(password);
    const confirmPasswordValidationMessage = validateConfirmPassword(
      password,
      confirmPassword
    );

    setNameError(nameValidationMessage);
    setEmailError(emailValidationMessage);
    setPhoneNumberError(phoneNumberValidationMessage);
    setPasswordError(passwordValidationMessage);
    setConfirmPasswordError(confirmPasswordValidationMessage);

    if (
      nameValidationMessage ||
      emailValidationMessage ||
      phoneNumberValidationMessage ||
      passwordValidationMessage ||
      confirmPasswordValidationMessage
    ) {
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3000/users/register", {
        name: name,
        email: email,
        password: password,
        phone_number: phoneNumber,
      });

      navigate("/verify-otp", {
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
                Create Account
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Sign up to start managing your expenses
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSignup}>
              <Stack spacing={2.5}>
                <TextField
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) {
                      setNameError("");
                    }
                  }}
                  error={!!nameError}
                  helperText={nameError}
                  fullWidth
                />

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

                <TextField
                  label="Phone Number"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneNumberError) {
                      setPhoneNumberError("");
                    }
                  }}
                  error={!!phoneNumberError}
                  helperText={phoneNumberError}
                  fullWidth
                />

                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) {
                      setPasswordError("");
                    }
                  }}
                  error={!!passwordError}
                  helperText={passwordError}
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN UP"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" textAlign="center">
              Already have an account?{" "}
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

export default SignupPage;