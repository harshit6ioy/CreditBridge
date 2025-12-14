import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../components/ProfileIcon";
import EmiCalculatorButton from "../components/EmiCalculatorButton";

export default function ApplyLoanPage1() {
  const navigate = useNavigate();

  /* ================= USER STATE ================= */
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  /* ================= FORM STATE ================= */
  const [panNumber, setPanNumber] = useState("");
  const [salary, setSalary] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [nationality, setNationality] = useState("Indian");
  const [age, setAge] = useState("");
  const [dependents, setDependents] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Added phone number field

  /* ================= LOAD VERIFIED USER ================= */
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("verifiedUser"));
      if (!storedUser || !storedUser.id) {
        alert("Please verify user first.");
        navigate("/user");
        return;
      }
      setUser(storedUser);
    } catch {
      navigate("/user");
    } finally {
      setLoadingUser(false);
    }
  }, [navigate]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  /* ================= SUBMIT ================= */
  const handleContinue = () => {
    if (!panNumber || !salary || !requestedAmount || !age || dependents === "" || !phoneNumber) {
      alert("All fields are required");
      return;
    }

    localStorage.setItem(
      "loanStep1Data",
      JSON.stringify({
        bankId: user.id,
        name: user.name,
        email: user.email,
        panNumber,
        salary,
        requestedAmount,
        maritalStatus,
        nationality,
        age,
        dependents,
        phoneNumber, // Added phone number to local storage
      })
    );

    navigate("/apply-loan-documents");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      {/* Animated Background Elements */}
      <EmiCalculatorButton />
      <ProfileIcon />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              Step 1 of 2
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              50% Complete
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
          {/* Card Header */}
          <div className="relative p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Loan Application</h1>
              <p className="text-blue-100">Complete your personal and financial details</p>
            </div>
            <div className="absolute bottom-4 right-8">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">User Verified</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {user.id}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-6">
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="PAN Number"
                placeholder="ABCDE1234F"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              />

              <Input
                label="Monthly Salary"
                type="number"
                placeholder="₹50,000"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Loan Amount"
                type="number"
                placeholder="₹5,00,000"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                value={requestedAmount}
                onChange={(e) => setRequestedAmount(e.target.value)}
              />

              <Select
                label="Marital Status"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option>Single</option>
                <option>Married</option>
              </Select>
            </div>

            {/* Row 3 */}
            <div className="grid md:grid-cols-3 gap-6">
              <Select
                label="Nationality"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              >
                <option>Indian</option>
                <option>Other</option>
              </Select>

              <Input
                label="Age"
                type="number"
                placeholder="28"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <Input
                label="Dependents"
                type="number"
                placeholder="2"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 2.5v-1.5a2.5 2.5 0 00-5 0v1.5" />
                  </svg>
                }
                value={dependents}
                onChange={(e) => setDependents(e.target.value)}
              />
            </div>

            {/* Row 4 - Phone Number Field */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 9876543210"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div></div> {/* Empty div to maintain grid layout */}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 pt-6 bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleContinue}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue to Document Upload</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              All information is securely encrypted and protected
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@bank.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@bank.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`w-full py-3 ${icon ? 'pl-12' : 'pl-4'} pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600`}
        />
      </div>
    </div>
  );
}

/* ================= SELECT COMPONENT ================= */
function Select({ label, icon, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <select
          {...props}
          className={`w-full py-3 ${icon ? 'pl-12' : 'pl-4'} pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 appearance-none`}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}