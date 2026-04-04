import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function EditExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [note, setNote] = useState("");

  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [expenseDateError, setExpenseDateError] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getTodayLocalDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getTodayLocalDate();

  const validateTitle = (value) => {
    if (!value.trim()) {
      return "Title is required";
    }
    return "";
  };

  const validateAmount = (value) => {
    if (!value) {
      return "Amount is required";
    }

    if (Number(value) <= 0) {
      return "Amount must be greater than 0";
    }

    return "";
  };

  const validateExpenseDate = (value) => {
    if (!value) {
      return "Expense date is required";
    }
    return "";
  };

  useEffect(() => {
    const fetchExpense = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const expense = response.data.expense;

        setTitle(expense.title || "");
        setAmount(expense.amount || "");
        setExpenseDate(expense.expense_date || "");
        setNote(expense.note || "");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expense details");
      } finally {
        setLoading(false);
      }
    };

    fetchExpense();
  }, [id, navigate, token]);

  const handleUpdateExpense = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const titleValidationMessage = validateTitle(title);
    const amountValidationMessage = validateAmount(amount);
    const expenseDateValidationMessage = validateExpenseDate(expenseDate);

    setTitleError(titleValidationMessage);
    setAmountError(amountValidationMessage);
    setExpenseDateError(expenseDateValidationMessage);

    if (
      titleValidationMessage ||
      amountValidationMessage ||
      expenseDateValidationMessage
    ) {
      return;
    }

    try {
      setSubmitLoading(true);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/${id}`,
        {
          title: title,
          amount: Number(amount),
          expense_date: expenseDate,
          note: note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || "Expense updated successfully");

      setTimeout(() => {
        navigate("/dashboard/expenses");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update expense");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Edit Expense
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Update your expense information
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/expenses")}
        >
          Back
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, maxWidth: 700 }}>
        <CardContent>
          <Box component="form" onSubmit={handleUpdateExpense}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) {
                    setTitleError("");
                  }
                }}
                error={!!titleError}
                helperText={titleError}
                fullWidth
              />

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (amountError) {
                    setAmountError("");
                  }
                }}
                error={!!amountError}
                helperText={amountError}
                fullWidth
              />

              <TextField
                label="Expense Date"
                type="date"
                value={expenseDate}
                onChange={(e) => {
                  setExpenseDate(e.target.value);
                  if (expenseDateError) {
                    setExpenseDateError("");
                  }
                }}
                error={!!expenseDateError}
                helperText={expenseDateError}
                fullWidth
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { max: today },
                }}
              />

              <TextField
                label="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                multiline
                rows={4}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={submitLoading}
                sx={{ py: 1.3 }}
              >
                {submitLoading ? "Updating..." : "Update Expense"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default EditExpensePage;