import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyResetOtpPage from "./pages/auth/VerifyResetOtpPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import DashboardPage from "./pages/dashboard/DashboardHomePage";
import ExpensesPage from "./pages/dashboard/ExpensesPage";
import AddExpensePage from "./pages/dashboard/AddExpensePage";
import EditExpensePage from "./pages/dashboard/EditExpensePage";
import ExpenseDetailsPage from "./pages/dashboard/ExpenseDetailsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import NotFoundPage from "./pages/dashboard/NotFoundPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* 
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/expenses/add" element={<AddExpensePage />} />
      <Route path="/expenses/:id" element={<ExpenseDetailsPage />} />
      <Route path="/expenses/edit/:id" element={<EditExpensePage />} />
      <Route path="/profile" element={<ProfilePage />} /> */}


      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHomePage/>} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="add-expense" element={<AddExpensePage />} />
        <Route path="expenses/:id" element={<ExpenseDetailsPage />} />
        <Route path="expenses/edit/:id" element={<EditExpensePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>


      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;