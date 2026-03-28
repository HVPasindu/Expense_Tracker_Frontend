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
import { setToken, setUser } from "../../utils/localStorage";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Enter Email and Password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3000/users/login", {
        email: email,
        password: password,
      });

      const data = response.data;

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
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
                Expense Tracker
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Welcome back! Login to your account
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Stack spacing={2.5}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                disabled={loading}
                onClick={handleLogin}
                sx={{ py: 1.4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
              </Button>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
            >
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  style={{ color: "#00a6fb", textDecoration: "none" }}
                >
                  Sign Up
                </Link>
              </Typography>

              <Typography variant="body2">
                <Link
                  to="/forgot-password"
                  style={{ color: "#00a6fb", textDecoration: "none" }}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;