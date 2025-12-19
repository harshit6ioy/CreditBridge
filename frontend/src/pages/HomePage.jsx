import ThemeToggle from "../components/ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat 
                    bg-[url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1800&q=80')]
                    dark:bg-[url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80')]
                    flex items-center justify-center relative">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      <ThemeToggle />

      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-md bg-white/20 dark:bg-gray-900/40 
                      backdrop-blur-xl border border-white/40 dark:border-gray-700 
                      rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6 
                       text-gray-900 dark:text-white tracking-wide">
          Welcome to Digital Loan Portal
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-sm">
          Please choose how you want to continue
        </p>

        <div className="flex flex-col gap-4">

         
          <button
            onClick={() => navigate("/user")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 
                       text-white rounded-lg font-semibold shadow-md transition-all"
          >
            Continue as User
          </button>

          
          <button
            onClick={() => navigate("/admin-login")}
            className="w-full py-3 bg-gray-900 hover:bg-black 
                       text-white dark:bg-gray-700 dark:hover:bg-gray-600
                       rounded-lg font-semibold shadow-md transition-all"
          >
            Continue as Admin
          </button>

        </div>
      </div>
    </div>
  );
}
