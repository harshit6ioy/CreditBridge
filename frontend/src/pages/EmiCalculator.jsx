import { useState } from "react";
import ThemeToggle from "../components/ThemeToggle";

export default function EmiCalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(5);

  // ---------------- EMI CALCULATION ----------------
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;

  const emi =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayable = emi * months;
  const totalInterest = totalPayable - amount;

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br
      from-blue-50 via-white to-indigo-50
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">

      <ThemeToggle />

      <h1 className="text-4xl font-extrabold text-center
        text-black dark:text-white mb-10">
        EMI Calculator
      </h1>

      <div className="max-w-4xl mx-auto
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        rounded-3xl shadow-2xl p-8 space-y-8">

        {/* ================= INPUTS ================= */}
        <Slider
          label="Loan Amount (₹)"
          min={50000}
          max={5000000}
          step={50000}
          value={amount}
          setValue={setAmount}
        />

        <Slider
          label="Interest Rate (% per annum)"
          min={5}
          max={20}
          step={0.1}
          value={rate}
          setValue={setRate}
        />

        <Slider
          label="Loan Tenure (Years)"
          min={1}
          max={30}
          step={1}
          value={years}
          setValue={setYears}
        />

        {/* ================= RESULTS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <ResultCard
            title="Monthly EMI"
            value={`₹ ${emi.toFixed(0)}`}
            color="blue"
          />

          <ResultCard
            title="Total Interest"
            value={`₹ ${totalInterest.toFixed(0)}`}
            color="red"
          />

          <ResultCard
            title="Total Payable"
            value={`₹ ${totalPayable.toFixed(0)}`}
            color="green"
          />
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          EMI values are indicative and may vary based on bank policies.
        </p>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Slider({ label, min, max, step, value, setValue }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <span className="font-bold text-blue-600 dark:text-blue-400">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none
          bg-gray-200 dark:bg-gray-700 accent-blue-600"
      />
    </div>
  );
}

function ResultCard({ title, value, color }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900
      border border-gray-300 dark:border-gray-700
      rounded-2xl shadow-md p-6 text-center">

      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        {title}
      </p>

      <p className={`text-3xl font-extrabold mt-2
        text-${color}-600 dark:text-${color}-400`}>
        {value}
      </p>
    </div>
  );
}
