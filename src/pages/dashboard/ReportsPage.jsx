import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function ReportsPage() {
  const token = localStorage.getItem("token");

  const [date, setDate] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [month, setMonth] = useState("");
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");

  const [dateResult, setDateResult] = useState(null);
  const [weekResult, setWeekResult] = useState(null);
  const [monthResult, setMonthResult] = useState(null);
  const [rangeResult, setRangeResult] = useState(null);

  const [error, setError] = useState("");
  const [loadingType, setLoadingType] = useState("");

  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getTodayLocalDate();

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleGetDateTotal = async () => {
    if (!date) {
      setError("You must select a date");
      return;
    }

    try {
      setError("");
      setLoadingType("date");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/date/${date}`,
        { headers }
      );

      setDateResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch date total");
    } finally {
      setLoadingType("");
    }
  };

  const handleGetWeekTotal = async () => {
    if (!weekStartDate || !weekEndDate) {
      setError("You must select start date and end date");
      return;
    }

    if (weekEndDate < weekStartDate) {
      setError("End date cannot be earlier than start date");
      return;
    }

    try {
      setError("");
      setLoadingType("week");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/weekly?start_date=${weekStartDate}&end_date=${weekEndDate}`,
        { headers }
      );

      setWeekResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch weekly total");
    } finally {
      setLoadingType("");
    }
  };

  const handleGetMonthTotal = async () => {
    if (!month) {
      setError("You must select a month");
      return;
    }

    const [year, monthValue] = month.split("-");

    try {
      setError("");
      setLoadingType("month");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/monthly?year=${year}&month=${monthValue}`,
        { headers }
      );

      setMonthResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch monthly total");
    } finally {
      setLoadingType("");
    }
  };

  const handleGetRangeTotal = async () => {
    if (!rangeStartDate || !rangeEndDate) {
      setError("You must select start date and end date");
      return;
    }

    if (rangeEndDate < rangeStartDate) {
      setError("End date cannot be earlier than start date");
      return;
    }

    try {
      setError("");
      setLoadingType("range");

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/date-range?start_date=${rangeStartDate}&end_date=${rangeEndDate}`,
        { headers }
      );

      setRangeResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch range total");
    } finally {
      setLoadingType("");
    }
  };

  const resetDateSection = () => {
    setDate("");
    setDateResult(null);
    setError("");
  };

  const resetWeekSection = () => {
    setWeekStartDate("");
    setWeekEndDate("");
    setWeekResult(null);
    setError("");
  };

  const resetMonthSection = () => {
    setMonth("");
    setMonthResult(null);
    setError("");
  };

  const resetRangeSection = () => {
    setRangeStartDate("");
    setRangeEndDate("");
    setRangeResult(null);
    setError("");
  };

  const renderExpenses = (expenses) => {
    if (!expenses || expenses.length === 0) {
      return <Typography color="text.secondary">No expenses found</Typography>;
    }

    return (
      <Stack spacing={1.5} mt={2}>
        {expenses.map((expense) => (
          <Box
            key={expense.id}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid #e5e7eb",
              backgroundColor: "#f8fbff",
            }}
          >
            <Typography fontWeight="bold">{expense.title}</Typography>
            <Typography variant="body2">Amount: Rs. {expense.amount}</Typography>
            <Typography variant="body2">Date: {expense.expense_date}</Typography>
            <Typography variant="body2">Note: {expense.note || "-"}</Typography>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Expense Reports
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Check expense totals by date, week, month, or custom range
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Total for Date
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Select Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today },
                }}
              />

              <Button
                variant="contained"
                onClick={handleGetDateTotal}
                disabled={loadingType === "date"}
              >
                {loadingType === "date" ? "Loading..." : "Check"}
              </Button>
            </Stack>

            {dateResult && (
              <Box mt={3}>
                <Typography fontWeight="bold">
                  Total Amount: Rs. {dateResult.total_amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Date: {dateResult.expense_date}
                </Typography>

                {renderExpenses(dateResult.expenses)}

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={resetDateSection}
                >
                  OK
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Total for Week
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                value={weekStartDate}
                onChange={(e) => {
                  setWeekStartDate(e.target.value);

                  if (weekEndDate && e.target.value && weekEndDate < e.target.value) {
                    setWeekEndDate("");
                  }
                }}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today },
                }}
              />

              <TextField
                label="End Date"
                type="date"
                value={weekEndDate}
                onChange={(e) => setWeekEndDate(e.target.value)}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    min: weekStartDate || undefined,
                    max: today,
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleGetWeekTotal}
                disabled={loadingType === "week"}
              >
                {loadingType === "week" ? "Loading..." : "Check"}
              </Button>
            </Stack>

            {weekResult && (
              <Box mt={3}>
                <Typography fontWeight="bold">
                  Total Amount: Rs. {weekResult.total_amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Start Date: {weekResult.start_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Date: {weekResult.end_date}
                </Typography>

                {renderExpenses(weekResult.expenses)}

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={resetWeekSection}
                >
                  OK
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Total for Month
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Select Month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today.slice(0, 7) },
                }}
              />

              <Button
                variant="contained"
                onClick={handleGetMonthTotal}
                disabled={loadingType === "month"}
              >
                {loadingType === "month" ? "Loading..." : "Check"}
              </Button>
            </Stack>

            {monthResult && (
              <Box mt={3}>
                <Typography fontWeight="bold">
                  Total Amount: Rs. {monthResult.total_amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Year: {monthResult.year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Month: {monthResult.month}
                </Typography>

                {renderExpenses(monthResult.expenses)}

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={resetMonthSection}
                >
                  OK
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Total for Range
            </Typography>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                value={rangeStartDate}
                onChange={(e) => {
                  setRangeStartDate(e.target.value);

                  if (rangeEndDate && e.target.value && rangeEndDate < e.target.value) {
                    setRangeEndDate("");
                  }
                }}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today },
                }}
              />

              <TextField
                label="End Date"
                type="date"
                value={rangeEndDate}
                onChange={(e) => setRangeEndDate(e.target.value)}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    min: rangeStartDate || undefined,
                    max: today,
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={handleGetRangeTotal}
                disabled={loadingType === "range"}
              >
                {loadingType === "range" ? "Loading..." : "Check"}
              </Button>
            </Stack>

            {rangeResult && (
              <Box mt={3}>
                <Typography fontWeight="bold">
                  Total Amount: Rs. {rangeResult.total_amount}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Start Date: {rangeResult.start_date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  End Date: {rangeResult.end_date}
                </Typography>

                {renderExpenses(rangeResult.expenses)}

                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={resetRangeSection}
                >
                  OK
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

export default ReportsPage;