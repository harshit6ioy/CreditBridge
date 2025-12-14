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
  const [loanPurpose, setLoanPurpose] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [nationality, setNationality] = useState("Indian");
  const [age, setAge] = useState("");
  const [dependents, setDependents] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading user details...</p>
        </div>
      </div>
    );
  }

  /* ================= SUBMIT ================= */
  const handleContinue = () => {
    if (
      !panNumber ||
      !salary ||
      !requestedAmount ||
      !loanPurpose ||
      !age ||
      dependents === "" ||
      !phoneNumber
    ) {
      alert("Please fill all required fields");
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
        loanPurpose,
        maritalStatus,
        nationality,
        age,
        dependents,
        phoneNumber,
      })
    );

    navigate("/apply-loan-documents");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
      <EmiCalculatorButton />
      <ProfileIcon />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Application</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Complete your personal and financial details</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Form */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden transition-colors duration-200">
              {/* Form Header */}
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2.1.1 Loan Summary</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">User Verified</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="px-8 py-6 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user?.name || "Annan Kumar"}</h3>
                    <p className="text-gray-600 dark:text-gray-300">ID: {user?.id || "101"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">50% Complete</div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="space-y-8">
                  {/* Row 1 - Financial Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        PAN Number
                      </label>
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Monthly Salary
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">₹</span>
                        <input
                          type="number"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="50,000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2 - Loan Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Loan Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">₹</span>
                        <input
                          type="number"
                          value={requestedAmount}
                          onChange={(e) => setRequestedAmount(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                          placeholder="15,00,000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Marital Status
                      </label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3 - Personal Details */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nationality
                      </label>
                      <select
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white"
                      >
                        <option value="Indian">Indian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="28"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Dependents
                      </label>
                      <input
                        type="number"
                        value={dependents}
                        onChange={(e) => setDependents(e.target.value)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="2"
                      />
                    </div>
                  </div>

                  {/* Row 4 - Contact */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  {/* Row 5 - Loan Purpose */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Loan Purpose
                    </label>
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Loan Purpose</option>
                      <option value="Education">Education</option>
                      <option value="Medical">Medical</option>
                      <option value="Home">Home</option>
                      <option value="Business">Business</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleContinue}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                  >
                    Continue to Document Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Progress & Info */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 sticky top-8 transition-colors duration-200">
              {/* Progress Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Step 1: Personal Details</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">50%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Step 2: Documents</span>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  {/* Review section removed */}
                </div>
              </div>

              {/* Signature Progress */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Signatures</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Sign 1 of 2</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Sign 2 of 2</span>
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">Pending</span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tips for Approval</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Ensure PAN details match your documents</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Provide accurate salary information</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Keep required documents ready for next step</span>
                  </li>
                </ul>
              </div>

              {/* Dark/Light Mode Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Switch theme in your browser settings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your information is secured with bank-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
}