import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Toggle Theme"
      className="
        fixed top-5 right-5 z-50
        p-2 rounded-full
        bg-gray-200 dark:bg-gray-700
        shadow-lg
        hover:scale-110 transition-transform duration-200
      "
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6 text-yellow-400" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-900 dark:text-white" />
      )}
    </button>
  );
}
