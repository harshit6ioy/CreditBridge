import { useNavigate } from "react-router-dom";

export default function ProfileIcon() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/profile")}
      title="Profile"
      className="
        fixed top-4 right-16 z-50
        w-10 h-10 rounded-full
        bg-blue-600 hover:bg-blue-700
        text-white text-lg
        flex items-center justify-center
        shadow-lg ring-2 ring-white/40
        transition-all duration-200
      "
    >
      👤
    </button>
  );
}
