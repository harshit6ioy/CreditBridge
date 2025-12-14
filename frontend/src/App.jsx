import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import UserLandingPage from "./pages/UserLandingPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";

import ApplyLoanPage1 from "./pages/ApplyLoanPage1";
import ApplyLoanPage2 from "./pages/ApplyLoanPage2";
import UserLoanStatus from "./pages/UserLoanStatus";
import EmiCalculator from "./pages/EmiCalculator";
import ThemeToggle from "./components/ThemeToggle";
import ProfilePage from "./pages/ProfilePage";
export default function App() {
  return (
    <BrowserRouter>

      {/* GLOBAL THEME TOGGLE */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Routes>

        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* USER VERIFICATION */}
        <Route path="/user" element={<UserLandingPage />} />

        {/* APPLY LOAN */}
        <Route path="/apply-loan-details" element={<ApplyLoanPage1 />} />
        <Route path="/apply-loan-documents" element={<ApplyLoanPage2 />} />

        {/* USER LOAN STATUS (✅ NEW) */}
        <Route path="/my-loans" element={<UserLoanStatus />} />

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/emi-calculator" element={<EmiCalculator />} />
      </Routes>

    </BrowserRouter>
  );
}
