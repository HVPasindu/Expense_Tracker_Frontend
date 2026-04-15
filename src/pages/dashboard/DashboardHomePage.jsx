import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function DashboardHomePage() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token");

  // useEffect(() => {
  //   const fetchDashboardSummary = async () => {
  //     if (!token) {
  //       navigate("/login");
  //       return;
  //     }

  //     try {
  //       setLoading(true);

  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_BASE_URL}/expenses/dashboard-summary`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setSummary(response.data.summary);
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to load dashboard");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardSummary();
  // }, [navigate, token]);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const today = new Date().toLocaleDateString("en-CA");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/expenses/dashboard-summary?today=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSummary(response.data.summary);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, [navigate, token]);

  const latestExpenseChartData =
    summary?.latest_expenses?.map((expense) => ({
      name:
        expense.title.length > 10
          ? `${expense.title.slice(0, 10)}...`
          : expense.title,
      amount: Number(expense.amount),
      fullTitle: expense.title,
    })) || [];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Welcome back, {user?.name || "User"}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AccountBalanceWalletIcon color="primary" />
              <Typography color="text.secondary">Total Expenses</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {summary?.total_expenses}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Total count of your added expenses
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <TodayIcon color="primary" />
              <Typography color="text.secondary">Today Total</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Rs. {summary?.today_total}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Total expense amount for today
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CalendarMonthIcon color="primary" />
              <Typography color="text.secondary">Monthly Total</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Rs. {summary?.monthly_total}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Total expense amount for this month
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Last 5 Expenses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent expense amounts in chart view
                </Typography>
              </Box>

              <Button
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/dashboard/expenses")}
              >
                View All
              </Button>
            </Box>

            <Box sx={{ width: "100%", height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latestExpenseChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`Rs. ${value}`, "Amount"]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullTitle;
                      }
                      return label;
                    }}
                  />
                  <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#00a6fb" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Recent Expense Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {summary?.latest_expenses?.length > 0 ? (
                summary.latest_expenses.map((expense) => (
                  <Box
                    key={expense.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: "#f8fbff",
                      border: "1px solid #e6eef5",
                    }}
                  >
                    <Typography fontWeight="bold">{expense.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {expense.expense_date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount: Rs. {expense.amount}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  No recent expenses found.
                </Typography>
              )}
            </Box>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate("/dashboard/expenses")}
            >
              More Details
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}

export default DashboardHomePage;