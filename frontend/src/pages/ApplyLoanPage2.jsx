import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import ProfileIcon from "../components/ProfileIcon";
import EmiCalculatorButton from "../components/EmiCalculatorButton";

export default function ApplyLoanPage2() {
  const navigate = useNavigate();

  const [panFile, setPanFile] = useState(null);
  const [salarySlip, setSalarySlip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const [verifiedUser, setVerifiedUser] = useState(null);
  const [loanDetails, setLoanDetails] = useState(null);

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [creditScoreData, setCreditScoreData] = useState(null);

  // ---------------- VALIDATE STEP-1 DATA ----------------
  useEffect(() => {
    if (checked) return;

    const user = JSON.parse(localStorage.getItem("verifiedUser"));
    const loan = JSON.parse(localStorage.getItem("loanStep1Data"));

    if (!user || !loan) {
      alert("Session expired. Please start again.");
      navigate("/user");
      return;
    }

    setVerifiedUser(user);
    setLoanDetails(loan);
    setChecked(true);
  }, [checked, navigate]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading application details...</p>
        </div>
      </div>
    );
  }

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async () => {
    if (!panFile || !salarySlip) {
      alert("Please upload both PAN Card and Salary Slip.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      // FILES
      form.append("pan", panFile);
      form.append("salarySlip", salarySlip);

      // USER DETAILS (FIXED KEYS)
      form.append("bankId", loanDetails.bankId);
      form.append("userName", loanDetails.name);
      form.append("userEmail", loanDetails.email);
      form.append("phoneNumber", loanDetails.phoneNumber);

      // LOAN DETAILS
      form.append("panNumber", loanDetails.panNumber);
      form.append("salary", loanDetails.salary);
      form.append("requestedAmount", loanDetails.requestedAmount);
      form.append("loanPurpose", loanDetails.loanPurpose);
      form.append("maritalStatus", loanDetails.maritalStatus);
      form.append("nationality", loanDetails.nationality);
      form.append("age", loanDetails.age);
      form.append("dependents", loanDetails.dependents);

      console.log("Submitting form data..."); // DEBUG LOG

      const res = await api.post("/apply-loan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", res.data); // DEBUG LOG
      
      localStorage.removeItem("loanStep1Data");
      
      // Save credit score data to localStorage for persistence
      localStorage.setItem("latestCreditScoreData", JSON.stringify({
        creditScore: res.data.creditScore,
        rating: res.data.creditRating,
        scoreBreakdown: res.data.scoreBreakdown,
        loanId: res.data.loanId
      }));
      
      // Set credit score data state
      setCreditScoreData({
        creditScore: res.data.creditScore,
        rating: res.data.creditRating,
        scoreBreakdown: res.data.scoreBreakdown
      });
      
      console.log("Setting modal with:", { // DEBUG LOG
        systemDecision: res.data.systemDecision,
        isApproved: res.data.systemDecision === "Pre-Approved",
        creditScore: res.data.creditScore,
        hasScoreBreakdown: !!res.data.scoreBreakdown
      });
      
      setIsApproved(res.data.systemDecision === "Pre-Approved");
      setShowModal(true);
    } catch (err) {
      console.error("Submission error:", err);
      console.error("Error response:", err.response?.data); // DEBUG LOG
      alert(err.response?.data?.message || "Submission failed");
    }

    setLoading(false);
  };

  // ---------------- UI ----------------
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
        <EmiCalculatorButton />
        <ProfileIcon />

        {/* Debug Button - Temporary */}
        <button
          onClick={() => {
            console.log("Current state:", {
              showModal,
              isApproved,
              creditScoreData,
              loanDetails,
              panFile: !!panFile,
              salarySlip: !!salarySlip
            });
          }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs z-50"
        >
          Debug State
        </button>

        {/* Test Modal Button - Temporary */}
        <button
          onClick={() => {
            // Test modal with rejected state
            setCreditScoreData({
              creditScore: 350,
              rating: "Poor",
              scoreBreakdown: {
                baseScore: 300,
                factors: [
                  { name: "Loan vs Salary", score: -100, reason: "Loan amount too high" },
                  { name: "Existing Loans", score: -50, reason: "You have existing loans" }
                ]
              }
            });
            setIsApproved(false);
            setShowModal(true);
          }}
          className="fixed bottom-16 right-4 bg-red-600 text-white p-2 rounded text-xs z-50"
        >
          Test Rejected Modal
        </button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Application</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Step 2: Document Upload & Submission</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Form */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden transition-colors duration-200">
                {/* Form Header */}
                <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2.2.1 Document Verification</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Pending Upload</span>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="px-8 py-6 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{loanDetails?.name || "Annan Kumar"}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Application ID: LA-{Date.now().toString().slice(-8)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Progress</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Step 2 of 2</div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <div className="space-y-8">
                    {/* Progress Bar */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Personal Details</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-green-500 dark:bg-green-400 h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between mt-4 mb-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Document Upload</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">50%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: panFile && salarySlip ? '100%' : panFile || salarySlip ? '50%' : '0%' }}></div>
                      </div>
                    </div>

                    {/* PAN Card Upload */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                            </svg>
                            PAN Card Upload
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a clear image or PDF of your PAN card</p>
                        </div>
                        {panFile && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setPanFile(e.target.files[0])}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400"
                      />
                      {panFile && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Selected: {panFile.name}
                        </div>
                      )}
                    </div>

                    {/* Salary Slip Upload */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Salary Slip Upload
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload your latest salary slip (PDF or image)</p>
                        </div>
                        {salarySlip && (
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setSalarySlip(e.target.files[0])}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400"
                      />
                      {salarySlip && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          Selected: {salarySlip.name}
                        </div>
                      )}
                    </div>

                    {/* Requirements Info */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Important Requirements
                      </h4>
                      <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-400">
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>Both documents are mandatory for loan processing</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>Files should be clear and legible</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span>Maximum file size: 5MB each</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Application...
                        </div>
                      ) : (
                        "Submit Application for Review"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Info & Progress */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 sticky top-8 transition-colors duration-200">
                {/* Application Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Loan Amount</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">₹{parseInt(loanDetails?.requestedAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Salary</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">₹{parseInt(loanDetails?.salary || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Loan Purpose</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{loanDetails?.loanPurpose}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">PAN Number</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{loanDetails?.panNumber}</span>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Documents Status</span>
                        <span className={`text-sm font-medium ${panFile && salarySlip ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {panFile && salarySlip ? 'Ready to Submit' : 'Pending Upload'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Checklist */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Checklist</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${panFile ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-sm ${panFile ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          PAN Card
                        </span>
                      </div>
                      {panFile ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs text-gray-400">Required</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${salarySlip ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className={`text-sm ${salarySlip ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          Salary Slip
                        </span>
                      </div>
                      {salarySlip ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-xs text-gray-400">Required</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Next Steps</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Submit both documents</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">System review (instant)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Get approval decision</span>
                    </li>
                  </ul>
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
              All uploaded documents are encrypted and securely stored
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className={`${isApproved ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} px-8 py-6`}>
              <div className={`text-6xl mb-4 text-center ${isApproved ? 'text-green-500' : 'text-red-500'}`}>
                {isApproved ? "✓" : "✗"}
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                {isApproved ? "Congratulations!" : "Application Review"}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
                {isApproved
                  ? "Your loan has been pre-approved!"
                  : "Unfortunately, your loan could not be approved at this time."}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Show breakdown immediately if approved */}
              {isApproved && creditScoreData && (
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Credit Score</h3>
                      <p className="text-gray-600 dark:text-gray-300">Based on your application details</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {creditScoreData.creditScore}
                      </div>
                      <div className={`text-sm font-semibold px-3 py-1 rounded-full ${creditScoreData.rating === 'Excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        creditScoreData.rating === 'Good' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        creditScoreData.rating === 'Fair' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {creditScoreData.rating}
                      </div>
                    </div>
                  </div>
                  
                  {/* Credit Score Breakdown */}
                  {creditScoreData.scoreBreakdown && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Score Breakdown
                      </h4>
                      
                      {/* Base Score */}
                      <div className="flex items-center justify-between mb-3 p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="font-bold">🏁</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Base Score</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Starting credit score</div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          +{creditScoreData.scoreBreakdown.baseScore}
                        </div>
                      </div>
                      
                      {/* Factors */}
                      <div className="space-y-2">
                        {creditScoreData.scoreBreakdown.factors.map((factor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-150">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{factor.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{factor.reason}</div>
                            </div>
                            <div className={`text-lg font-bold ${factor.score > 0 ? 'text-green-600 dark:text-green-400' : factor.score < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                              {factor.score > 0 ? '+' : ''}{factor.score}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Total Score */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">Final Credit Score</div>
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {creditScoreData.creditScore}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Show message if rejected */}
              {!isApproved && (
                <div className="mb-8 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Application Not Approved</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {creditScoreData 
                          ? "Your credit score was below the required threshold"
                          : "Your application did not meet the approval criteria"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show credit score if available */}
                  {creditScoreData && (
                    <>
                      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-700 dark:text-gray-300">Your Credit Score:</span>
                          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{creditScoreData.creditScore}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300">Required Score:</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">500+</span>
                        </div>
                      </div>
                      
                      {/* Show key negative factors */}
                      {creditScoreData.scoreBreakdown && (
                        <div className="mt-6">
                          <h4 className="font-bold text-gray-900 dark:text-white mb-3">Areas to Improve:</h4>
                          <div className="space-y-2">
                            {creditScoreData.scoreBreakdown.factors
                              .filter(factor => factor.score < 0)
                              .map((factor, index) => (
                                <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{factor.name}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-300">{factor.reason}</div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Show generic message if no creditScoreData */}
                  {!creditScoreData && (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300">
                        The system could not approve your application based on the provided information.
                        You may try again with updated details or contact support for more information.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {/* If approved: Show breakdown AND go to My Loans */}
                {isApproved ? (
                  <>
                    <button
                      onClick={() => navigate("/user")}
                      className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      Back to Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/my-loans")}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                    >
                      View in My Loans
                    </button>
                  </>
                ) : (
                  // If rejected: Just go back to dashboard
                  <button
                    onClick={() => navigate("/user")}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200"
                  >
                    Return to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}