import { useNavigate } from "react-router-dom";

export default function EmiCalculatorButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/emi-calculator")}
      className="
        fixed bottom-6 right-6 z-40
        bg-indigo-600 hover:bg-indigo-700
        text-white font-bold
        px-5 py-3 rounded-full
        shadow-2xl
        transition-all
        flex items-center gap-2
      "
    >
      📊 EMI Calculator
    </button>
  );
}
