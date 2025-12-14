import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import authApi from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setMsg("Email and password are required");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await authApi.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      // ✅ store admin token
      localStorage.setItem("adminToken", res.data.token);

      setMsg("Login Successful!");

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 600);
    } catch (err) {
      console.error("Admin login error:", err);
      setMsg(err.response?.data?.message || "Invalid email or password");
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat
      bg-[url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1800&q=80')]
      dark:bg-[url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1800&q=80')]
      flex items-center justify-center relative"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      <ThemeToggle />

      {/* Login Card */}
      <div
        className="relative z-10 w-[90%] max-w-md
        bg-white/20 dark:bg-gray-900/40
        backdrop-blur-xl border border-white/40 dark:border-gray-700
        rounded-2xl shadow-2xl p-8"
      >
        <h1 className="text-3xl font-extrabold text-center text-white mb-6">
          Admin Login
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 rounded-lg
            bg-white/60 dark:bg-gray-800/70
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg
            bg-white/60 dark:bg-gray-800/70
            text-gray-900 dark:text-white
            border border-gray-300 dark:border-gray-700
            focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-gray-900 hover:bg-black
            dark:bg-gray-700 dark:hover:bg-gray-600
            text-white font-bold rounded-lg
            shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {msg && (
            <p className="text-center text-white font-semibold mt-2">
              {msg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
