import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AddExpensePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [note, setNote] = useState("");

  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [expenseDateError, setExpenseDateError] = useState("");

  const [loading, setLoading] = useState(false);
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

  const handleAddExpense = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      navigate("/login");
      return;
    }

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
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3000/expenses",
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

      setSuccess(response.data.message || "Expense added successfully");

      setTitle("");
      setAmount("");
      setExpenseDate("");
      setNote("");

      setTimeout(() => {
        navigate("/dashboard/expenses");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

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
            Add Expense
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create a new expense record
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
          <Box component="form" onSubmit={handleAddExpense}>
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
                startIcon={<AddIcon />}
                disabled={loading}
                sx={{ py: 1.3 }}
              >
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddExpensePage;