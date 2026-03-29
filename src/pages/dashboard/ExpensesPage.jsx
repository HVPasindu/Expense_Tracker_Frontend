import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function ExpensesPage() {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [error, setError] = useState("");

  const [openSlipExpenseId, setOpenSlipExpenseId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [expenseSlips, setExpenseSlips] = useState({});
  const [slipLoadingId, setSlipLoadingId] = useState(null);
  const [slipUploadLoadingId, setSlipUploadLoadingId] = useState(null);
  const [slipDeleteLoadingId, setSlipDeleteLoadingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchExpenses = async (currentPage = 1) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:3000/expenses?page=${currentPage}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenses(response.data.expenses || []);
      setPagination(response.data.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(page);
  }, [page]);

  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoadingId(id);

      await axios.delete(`http://localhost:3000/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchExpenses(page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const fetchSlipsByExpense = async (expenseId) => {
    try {
      setSlipLoadingId(expenseId);
      setError("");

      const response = await axios.get(
        `http://localhost:3000/expense-slips/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExpenseSlips((prev) => ({
        ...prev,
        [expenseId]: response.data.slips || [],
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load slips");
    } finally {
      setSlipLoadingId(null);
    }
  };

  const handleToggleSlipSection = async (expenseId) => {
    if (openSlipExpenseId === expenseId) {
      setOpenSlipExpenseId(null);
      return;
    }

    setOpenSlipExpenseId(expenseId);
    await fetchSlipsByExpense(expenseId);
  };

  const handleFileChange = (expenseId, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [expenseId]: file,
    }));
  };

  const handleUploadSlip = async (expenseId) => {
    const file = selectedFiles[expenseId];

    if (!file) {
      setError("Please select a slip file first");
      return;
    }

    try {
      setSlipUploadLoadingId(expenseId);
      setError("");

      const formData = new FormData();
      formData.append("slip", file);

      await axios.post(
        `http://localhost:3000/expense-slips/${expenseId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFiles((prev) => ({
        ...prev,
        [expenseId]: null,
      }));

      await fetchSlipsByExpense(expenseId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload slip");
    } finally {
      setSlipUploadLoadingId(null);
    }
  };

  const handleDeleteSlip = async (expenseId, slipId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this slip?");

    if (!confirmDelete) {
      return;
    }

    try {
      setSlipDeleteLoadingId(slipId);
      setError("");

      await axios.delete(`http://localhost:3000/expense-slips/slip/${slipId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchSlipsByExpense(expenseId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete slip");
    } finally {
      setSlipDeleteLoadingId(null);
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
            All Expenses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View, update, delete, and manage your expense slips
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/add-expense")}
        >
          Add Expense
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
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
      ) : expenses.length === 0 ? (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6">No expenses found</Typography>
            <Typography color="text.secondary" mt={1}>
              Start by adding your first expense
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Stack spacing={2.5}>
            {expenses.map((expense) => {
              const slips = expenseSlips[expense.id] || [];

              return (
                <Card
                  key={expense.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 220 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {expense.title}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 1 }}>
                          <strong>Amount:</strong> Rs. {expense.amount}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          <strong>Date:</strong> {expense.expense_date}
                        </Typography>

                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                          <strong>Note:</strong> {expense.note || "-"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/dashboard/expenses/edit/${expense.id}`)}
                        >
                          Update
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<DeleteIcon />}
                          disabled={deleteLoadingId === expense.id}
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          {deleteLoadingId === expense.id ? "Deleting..." : "Delete"}
                        </Button>

                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<ReceiptLongIcon />}
                          disabled={slipLoadingId === expense.id}
                          onClick={() => handleToggleSlipSection(expense.id)}
                        >
                          {openSlipExpenseId === expense.id ? "Close Slip" : "Slip"}
                        </Button>
                      </Box>
                    </Box>

                    {openSlipExpenseId === expense.id && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          borderRadius: 3,
                          backgroundColor: "#f8fbff",
                          border: "1px solid #dbe7f3",
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                          Expense Slips
                        </Typography>

                        <Stack spacing={2}>
                          <Box>
                           

                            {selectedFiles[expense.id] && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected File: {selectedFiles[expense.id].name}
                              </Typography>
                            )}
                          </Box>

                          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Button
                              variant="contained"
                              onClick={() => handleUploadSlip(expense.id)}
                              disabled={slipUploadLoadingId === expense.id}
                            >
                              {slipUploadLoadingId === expense.id
                                ? "Uploading..."
                                : "Upload Slip"}
                            </Button>

                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              component="label"
                            >
                              Add Slip
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    expense.id,
                                    e.target.files?.[0] || null
                                  )
                                }
                              />
                            </Button>
                          </Box>

                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                              Uploaded Slips
                            </Typography>

                            {slipLoadingId === expense.id ? (
                              <CircularProgress size={24} />
                            ) : slips.length > 0 ? (
                              <Stack spacing={2}>
                                {slips.map((slip) => (
                                  <Box
                                    key={slip.id}
                                    sx={{
                                      p: 2,
                                      borderRadius: 3,
                                      backgroundColor: "#ffffff",
                                      border: "1px solid #e5e7eb",
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={slip.file_url}
                                      alt="Expense Slip"
                                      sx={{
                                        width: "100%",
                                        maxWidth: 320,
                                        height: "auto",
                                        borderRadius: 2,
                                        border: "1px solid #ddd",
                                        mb: 1.5,
                                      }}
                                    />

                                    <Typography variant="body2" color="text.secondary">
                                      Uploaded At: {new Date(slip.uploaded_at).toLocaleString()}
                                    </Typography>

                                    <Button
                                      variant="contained"
                                      color="error"
                                      sx={{ mt: 1.5 }}
                                      disabled={slipDeleteLoadingId === slip.id}
                                      onClick={() => handleDeleteSlip(expense.id, slip.id)}
                                    >
                                      {slipDeleteLoadingId === slip.id
                                        ? "Deleting..."
                                        : "Delete Slip"}
                                    </Button>
                                  </Box>
                                ))}
                              </Stack>
                            ) : (
                              <Typography color="text.secondary">
                                No slips uploaded for this expense
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </Stack>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Typography variant="body1" fontWeight="bold">
              Page {pagination?.current_page || page} of {pagination?.total_pages || 1}
            </Typography>

            <Button
              variant="outlined"
              disabled={page === pagination?.total_pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default ExpensesPage;