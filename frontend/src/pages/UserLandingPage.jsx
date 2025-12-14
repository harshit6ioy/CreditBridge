import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function UserLandingPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bankId, setBankId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanBankId = bankId.trim();

    if (!cleanName || !cleanEmail || !cleanBankId) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/verify-user", {
        name: cleanName,
        email: cleanEmail,
        bankId: cleanBankId,
      });

      console.log("Verified User:", res.data);

      // Save verified user to use in ApplyLoanPage1
      localStorage.setItem("verifiedUser", JSON.stringify(res.data.user));

      alert("User verified successfully!");

      // Redirect to Loan Details Page (STEP 1)
      navigate("/apply-loan-details");

    } catch (err) {
      console.log("Verification Error:", err.response?.data || err);
      alert(err.response?.data?.message || "User verification failed!");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat 
      bg-[url('https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1800&q=80')]
      dark:bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=80')]
      flex items-center justify-center relative"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      {/* Theme Toggle (global UI button) */}
      <ThemeToggle />

      {/* Card */}
      <div
        className="relative z-10 w-[90%] max-w-md bg-white/20 dark:bg-gray-900/40 
        backdrop-blur-xl border border-white/40 dark:border-gray-700 
        rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          User Verification
        </h1>

        <div className="flex flex-col gap-4">

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-white/60 dark:bg-gray-800/70 
            text-gray-900 dark:text-white font-bold border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/^\s+/, ""))}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-white/60 dark:bg-gray-800/70 
            text-gray-900 dark:text-white font-bold border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value.replace(/^\s+/, ""))}
          />

          {/* Bank ID */}
          <input
            type="number"
            placeholder="Bank ID"
            className="w-full p-3 rounded-lg bg-white/60 dark:bg-gray-800/70 
            text-gray-900 dark:text-white font-bold border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 outline-none"
            value={bankId}
            onChange={(e) => setBankId(e.target.value.replace(/^\s+/, ""))}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
            text-white uppercase font-bold tracking-wide rounded-lg shadow-lg 
            transition-all duration-300"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>

        </div>
      </div>
    </div>
  );
}
