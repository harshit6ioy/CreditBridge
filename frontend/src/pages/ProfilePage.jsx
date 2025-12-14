import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import ThemeToggle from "../components/ThemeToggle";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
  });

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("verifiedUser"));

    if (!storedUser || !storedUser.id) {
      navigate("/user");
      return;
    }

    setUser(storedUser);
    fetchLoanStats(storedUser.id);
  }, [navigate]);

  // ---------------- FETCH LOAN STATS ----------------
  async function fetchLoanStats(bankId) {
    try {
      const res = await api.get(`/user-loans/${bankId}`);
      const loans = res.data;

      setStats({
        total: loans.length,
        approved: loans.filter(l => l.adminFinalStatus === "Approved").length,
        rejected: loans.filter(l => l.adminFinalStatus === "Rejected").length,
        pending: loans.filter(l => l.adminFinalStatus === "Pending").length,
      });
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center
        bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        Loading profile...
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <ThemeToggle />

      <h1 className="text-4xl font-extrabold text-center
        text-black dark:text-white mb-8">
        User Profile
      </h1>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= USER INFO ================= */}
        <div className="bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-3xl shadow-2xl p-6">

          <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-lg">
            <Info label="Name" value={user.name} />
            <Info label="Bank ID" value={user.id} />
            <Info label="Email" value={user.email} />
          </div>
        </div>

        {/* ================= LOAN SUMMARY ================= */}
        <div className="bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-3xl shadow-2xl p-6">

          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
            Loan Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Stat title="Total Loans" value={stats.total} color="blue" />
            <Stat title="Approved" value={stats.approved} color="green" />
            <Stat title="Rejected" value={stats.rejected} color="red" />
            <Stat title="Pending" value={stats.pending} color="yellow" />
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/apply-loan-details")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700
              text-white font-bold rounded-xl shadow-lg"
          >
            Apply New Loan
          </button>

          <button
            onClick={() => navigate("/my-loans")}
            className="px-6 py-3 bg-green-600 hover:bg-green-700
              text-white font-bold rounded-xl shadow-lg"
          >
            View My Loans
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-700
              text-white font-bold rounded-xl shadow-lg"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {label}
      </p>
      <p className="text-black dark:text-white font-bold">
        {value}
      </p>
    </div>
  );
}

function Stat({ title, value, color }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900
      border border-gray-300 dark:border-gray-700
      rounded-2xl shadow-md p-4 text-center">

      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {title}
      </p>

      <p className={`text-3xl font-extrabold
        text-${color}-600 dark:text-${color}-400`}>
        {value}
      </p>
    </div>
  );
}
