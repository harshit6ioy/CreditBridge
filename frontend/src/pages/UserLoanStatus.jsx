import { useEffect, useState } from "react";
import api from "../api/api";
import ProfileIcon from "../components/ProfileIcon";
import EmiCalculatorButton from "../components/EmiCalculatorButton";

export default function UserLoanStatus() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const user = JSON.parse(localStorage.getItem("verifiedUser"));

  useEffect(() => {
    async function fetchUserLoans() {
      try {
        setLoading(true);
        const res = await api.get(`/user-loans/${user.id}`);
        setLoans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      fetchUserLoans();
    }
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getApprovalColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
      case "Rejected": return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
      case "Pending": return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300";
      default: return "bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const handleScoreClick = (loan) => {
    setSelectedLoan(loan);
    setShowScoreModal(true);
  };

  // Check if this loan has breakdown data in localStorage
  const getLatestBreakdown = () => {
    try {
      const latestData = localStorage.getItem("latestCreditScoreData");
      if (latestData) {
        const parsed = JSON.parse(latestData);
        // Check if this is the same loan (by comparing loanId or other criteria)
        if (selectedLoan && parsed.loanId === selectedLoan._id) {
          return parsed.scoreBreakdown;
        }
      }
    } catch (error) {
      console.error("Error getting breakdown from localStorage:", error);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your loan applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-200">
      <EmiCalculatorButton />
      <ProfileIcon />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Loan Applications</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Track and manage all your loan applications in one place</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden transition-colors duration-200">
              {/* Table Header */}
              <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loan Applications History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Showing {loans.length} application{loans.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${loans.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {loans.length > 0 ? 'Active' : 'No Applications'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50">
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Loan Details
                        </span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Credit Score
                        </span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          System Status
                        </span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Final Decision
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {loans.map((loan) => (
                      <tr 
                        key={loan._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        {/* Loan Amount Cell */}
                        <td className="py-5 px-6">
                          <div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                              <div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                  ₹{loan.requestedAmount?.toLocaleString() || '0'}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {loan.loanPurpose || 'Personal Loan'}
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  Applied: {new Date(loan.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Credit Score Cell - NOW CLICKABLE */}
                        <td className="py-5 px-6">
                          <button
                            onClick={() => handleScoreClick(loan)}
                            className="flex items-center hover:opacity-80 transition-opacity duration-200"
                          >
                            <div className="relative">
                              <div className="w-16 h-16">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={loan.creditScore >= 700 ? "#10B981" : loan.creditScore >= 600 ? "#F59E0B" : "#EF4444"}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray={`${loan.creditScore / 10}, 100`}
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold">
                                    {loan.creditScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className={`text-xs font-medium px-2 py-1 rounded-full ${loan.creditScore >= 700 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : loan.creditScore >= 600 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                {loan.creditScore >= 700 ? 'Excellent' : loan.creditScore >= 600 ? 'Good' : 'Fair'}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Click to view details
                              </div>
                            </div>
                          </button>
                        </td>

                        {/* System Status Cell */}
                        <td className="py-5 px-6">
                          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(loan.approvalStatus)}`}>
                            {loan.approvalStatus === "Pre-Approved" && (
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {loan.approvalStatus === "Pre-Rejected" && (
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                            {loan.approvalStatus}
                          </div>
                        </td>

                        {/* Final Decision Cell */}
                        <td className="py-5 px-6">
                          <div className={`px-4 py-2.5 rounded-xl font-bold ${getApprovalColor(loan.adminFinalStatus)}`}>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                {loan.adminFinalStatus === "Approved" && (
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {loan.adminFinalStatus === "Rejected" && (
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {loan.adminFinalStatus === "Pending" && (
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {loan.adminFinalStatus}
                              </span>
                              <span className="text-xs opacity-75">
                                {loan.adminFinalStatus === "Approved" ? 'Ready' : 
                                 loan.adminFinalStatus === "Rejected" ? 'Closed' : 'Under Review'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Empty State */}
                {loans.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      No Loan Applications
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                      You haven't applied for any loans yet. Start your first loan application today!
                    </p>
                    <button
                      onClick={() => window.location.href = '/user'}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
                    >
                      Apply for Loan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Summary & Stats */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-6 sticky top-8 transition-colors duration-200">
              {/* Summary Stats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Applications</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{loans.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Approved</span>
                    </div>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {loans.filter(l => l.adminFinalStatus === 'Approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {loans.filter(l => l.adminFinalStatus === 'Pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Rejected</span>
                    </div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {loans.filter(l => l.adminFinalStatus === 'Rejected').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credit Score Info */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Credit Score Guide</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Excellent (700+)</span>
                    </div>
                    <span className="text-xs text-gray-400">High Approval</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Good (600-699)</span>
                    </div>
                    <span className="text-xs text-gray-400">Medium Approval</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">Fair (Below 600)</span>
                    </div>
                    <span className="text-xs text-gray-400">Low Approval</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/apply-loan-1'}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Apply for New Loan
                  </button>
                  <button
                    onClick={() => window.location.href = '/emi-calculator'}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-800 dark:text-gray-300 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    EMI Calculator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score Breakdown Modal */}
      {showScoreModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Credit Score Details
                </h3>
                <button
                  onClick={() => setShowScoreModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Score Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {selectedLoan.creditScore}
                  </div>
                  <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                    selectedLoan.creditScore >= 700 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    selectedLoan.creditScore >= 600 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    selectedLoan.creditScore >= 500 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {selectedLoan.creditScore >= 700 ? 'Excellent' :
                     selectedLoan.creditScore >= 600 ? 'Good' :
                     selectedLoan.creditScore >= 500 ? 'Fair' : 'Poor'}
                  </div>
                </div>
              </div>
              
              {/* Loan Info */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Loan Amount:</span>
                  <span className="font-bold">₹{selectedLoan.requestedAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Loan Purpose:</span>
                  <span className="font-bold">{selectedLoan.loanPurpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Application Date:</span>
                  <span className="font-bold">{new Date(selectedLoan.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">System Decision:</span>
                  <span className={`font-bold ${
                    selectedLoan.approvalStatus === "Pre-Approved" ? "text-green-600 dark:text-green-400" :
                    "text-red-600 dark:text-red-400"
                  }`}>
                    {selectedLoan.approvalStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Final Status:</span>
                  <span className={`font-bold ${
                    selectedLoan.adminFinalStatus === "Approved" ? "text-green-600 dark:text-green-400" :
                    selectedLoan.adminFinalStatus === "Rejected" ? "text-red-600 dark:text-red-400" :
                    "text-yellow-600 dark:text-yellow-400"
                  }`}>
                    {selectedLoan.adminFinalStatus}
                  </span>
                </div>
              </div>
              
              {/* Check for breakdown data */}
              {(() => {
                const breakdown = getLatestBreakdown();
                if (breakdown) {
                  return (
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Score Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">Base Score:</span>
                          <span className="font-bold">+{breakdown.baseScore}</span>
                        </div>
                        {breakdown.factors.map((factor, index) => (
                          <div key={index} className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{factor.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{factor.reason}</div>
                            </div>
                            <div className={`font-bold ${factor.score > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {factor.score > 0 ? '+' : ''}{factor.score}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              
              {/* Note about breakdown */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      {getLatestBreakdown() 
                        ? "This is the detailed breakdown from your latest application."
                        : "Detailed score breakdown (with factor-by-factor analysis) is only available immediately after application submission."
                      }
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Next time, you can view the full breakdown right after submitting your application.
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowScoreModal(false)}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}