import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./utils/localStorage";



import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyResetOtpPage from "./pages/auth/VerifyResetOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";


import DashboardPage from "./pages/dashboard/DashboardPage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import AddExpensePage from "./pages/dashboard/AddExpensePage";
import EditExpensePage from "./pages/dashboard/EditExpensePage";
import ExpenseDetailsPage from "./pages/dashboard/ExpenseDetailsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotFoundPage from "./pages/dashboard/NotFoundPage";




function App() {
  const token = getToken();

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />

      <Route
        path="/signup"
        element={token ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />

      <Route
        path="/verify-otp"
        element={token ? <Navigate to="/dashboard" replace /> : <VerifyOtpPage />}
      />

      <Route
        path="/forgot-password"
        element={token ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />}
      />

      <Route
        path="/verify-reset-otp"
        element={token ? <Navigate to="/dashboard" replace /> : <VerifyResetOtpPage />}
      />

      <Route
        path="/reset-password"
        element={token ? <Navigate to="/dashboard" replace /> : <ResetPasswordPage />}
      />

      <Route
        path="/dashboard"
        element={token ? <DashboardPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/expenses"
        element={token ? <ExpensesPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/expenses/add"
        element={token ? <AddExpensePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/expenses/:id"
        element={token ? <ExpenseDetailsPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/expenses/edit/:id"
        element={token ? <EditExpensePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/profile"
        element={token ? <ProfilePage /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;