import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import api from "../api/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  const token = localStorage.getItem("adminToken");

  
  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
      return;
    }
    fetchLoans();
  }, [token]);

 
  async function fetchLoans() {
    setLoading(true);
    try {
      const res = await api.get("/all-loans", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allLoans = res.data || [];
      console.log("API Response:", allLoans); // Debug log
      console.log("First loan structure:", allLoans[0]); // Debug log
      
      // Check what fields exist in the data
      if (allLoans.length > 0) {
        const firstLoan = allLoans[0];
        console.log("Available fields:", Object.keys(firstLoan));
        console.log("Possible ID fields:", {
          _id: firstLoan._id,
          userId: firstLoan.userId,
          applicationId: firstLoan.applicationId,
          bankId: firstLoan.bankId,
          loanId: firstLoan.loanId
        });
      }
      
      const filteredLoans = allLoans.filter(l => l.adminFinalStatus !== "Rejected");
      
      setLoans(filteredLoans);
      setFilteredLoans(filteredLoans);

      setApprovedCount(allLoans.filter(l => l.adminFinalStatus === "Approved").length);
      setRejectedCount(allLoans.filter(l => l.adminFinalStatus === "Rejected").length);
      setPendingCount(allLoans.filter(l => l.adminFinalStatus === "Pending").length);
      
    } catch (err) {
      console.error("Error fetching loans:", err);
      setMsg("Session expired. Please login again.");
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  }

 
  async function updateLoanStatus(id, decision) {
    try {
      await api.put(
        `/admin/update-loan/${id}`,
        { decision },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(`Loan ${decision} successfully`);
      fetchLoans();
    } catch (err) {
      console.error(err);
      setMsg("Error updating loan");
    }
  }

  
  const searchInLoan = (loan, searchTerm) => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    
    
    const fieldsToSearch = [
      loan.bankId, // Try bankId first
      loan._id, // MongoDB _id
      loan.userId, // User ID
      loan.applicationId, // Application ID
      loan.loanId, // Loan ID
      loan.userName, // User name
      loan.userEmail, // User email
      loan.phoneNumber, // Phone number
      loan.panNumber, // PAN number
      loan.requestedAmount?.toString(), // Amount as string
      loan.creditScore?.toString(), // Credit score as string
    ];
    
    return fieldsToSearch.some(field => {
      if (!field) return false;
      return field.toString().toLowerCase().includes(term);
    });
  };

 
  const applyFilters = () => {
    try {
      console.log("Applying filters...");
      console.log("Search term:", searchTerm);
      console.log("Total loans:", loans.length);
      
      let results = [...loans];

      
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        results = results.filter(loan => {
          if (!loan) return false;
          
          // Try all possible fields that might contain the search term
          const searchableText = [
            loan.bankId || '',
            loan._id || '',
            loan.userId || '',
            loan.applicationId || '',
            loan.loanId || '',
            loan.userName || '',
            loan.userEmail || '',
            loan.phoneNumber || '',
            loan.panNumber || '',
            loan.requestedAmount?.toString() || '',
            loan.creditScore?.toString() || '',
          ].join(' ').toLowerCase();
          
          return searchableText.includes(term);
        });
        console.log("After search count:", results.length);
      }

      
      if (statusFilter !== "All") {
        results = results.filter(loan => loan?.adminFinalStatus === statusFilter);
      }

      
      const minAmount = amountRange.min ? parseInt(amountRange.min) : 0;
      const maxAmount = amountRange.max ? parseInt(amountRange.max) : Infinity;
      
      if (minAmount > 0 || maxAmount < Infinity) {
        results = results.filter(loan => {
          const amount = loan?.requestedAmount || 0;
          return amount >= minAmount && amount <= maxAmount;
        });
      }

      
      results.sort((a, b) => {
        const aAmount = a?.requestedAmount || 0;
        const bAmount = b?.requestedAmount || 0;
        const aScore = a?.creditScore || 0;
        const bScore = b?.creditScore || 0;
        
        // Handle dates safely
        let aDate, bDate;
        try {
          aDate = a?.createdAt ? new Date(a.createdAt) : new Date(0);
          bDate = b?.createdAt ? new Date(b.createdAt) : new Date(0);
        } catch (e) {
          aDate = new Date(0);
          bDate = new Date(0);
        }

        switch (sortBy) {
          case "newest":
            return bDate - aDate;
          case "oldest":
            return aDate - bDate;
          case "amount-high":
            return bAmount - aAmount;
          case "amount-low":
            return aAmount - bAmount;
          case "score-high":
            return bScore - aScore;
          case "score-low":
            return aScore - bScore;
          default:
            return 0;
        }
      });

      console.log("Final filtered results:", results);
      setFilteredLoans(results);
      
    } catch (error) {
      console.error("Error applying filters:", error);
      setFilteredLoans([]);
    }
  };

 
  useEffect(() => {
    if (loans.length > 0) {
      applyFilters();
    }
  }, [loans, searchTerm, statusFilter, amountRange, sortBy]);

 
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setAmountRange({ min: "", max: "" });
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage all loan applications from one place
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                navigate("/admin-login");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-center font-semibold text-blue-600 dark:text-blue-400">
              {msg}
            </p>
          </div>
        )}

       
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          <StatCard 
            title="Approved Loans" 
            value={approvedCount} 
            color="green" 
            icon="✓"
          />
          <StatCard 
            title="Rejected Loans" 
            value={rejectedCount} 
            color="red" 
            icon="✗"
          />
          <StatCard 
            title="Pending Review" 
            value={pendingCount} 
            color="yellow" 
            icon="⏳"
          />
        </div>

       
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Loan Applications
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({filteredLoans.length} found)
              </span>
            </h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search (ID, Name, Email, PAN, Phone)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
                  placeholder="Search by any field..."
                  className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Search
                </button>
              </div>
              
              {/* Debug info */}
              {loans.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>Sample IDs in data:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {loans.slice(0, 3).map((loan, i) => (
                      <span key={i} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {loan._id?.substring(0, 8)}...
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
                <option value="score-high">Credit Score (High to Low)</option>
                <option value="score-low">Credit Score (Low to High)</option>
              </select>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <input
                  type="number"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

       
        {loading ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading loan applications...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-hidden">
            {filteredLoans.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  {loans.length === 0 
                    ? "No loan applications found." 
                    : "No loans match your search criteria."}
                </div>
                {searchTerm && (
                  <div className="mt-4 text-sm text-gray-400">
                    <p>Searched for: <strong>"{searchTerm}"</strong></p>
                    <p className="mt-2">Total loans in system: {loans.length}</p>
                    <p className="text-xs mt-2">Try searching by: Name, Email, PAN, Phone, or ID</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      {/* Updated headers based on likely data structure */}
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">PAN</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Credit Score</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">System Status</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Admin Status</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Documents</th>
                      <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredLoans.map((loan, index) => {
                      if (!loan) return null;
                      
                      const creditScore = loan.creditScore || 0;
                      const requestedAmount = loan.requestedAmount || 0;
                      const adminStatus = loan.adminFinalStatus || "Pending";
                      
                      // Get the ID to display - try multiple possible fields
                      const displayId = loan.bankId || loan._id?.substring(0, 8) || loan.userId || loan.applicationId || "N/A";
                      
                      return (
                        <tr
                          key={loan._id || index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                        >
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {displayId}
                            </span>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {loan.userName || "N/A"}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="text-gray-600 dark:text-gray-400 truncate max-w-[150px]">
                              {loan.userEmail || "N/A"}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="text-gray-600 dark:text-gray-400">
                              {loan.phoneNumber || "N/A"}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                              {loan.panNumber || "N/A"}
                            </code>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              ₹{requestedAmount.toLocaleString()}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className={`w-16 h-2 rounded-full mr-2 ${
                                creditScore >= 750 ? 'bg-green-500' :
                                creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></div>
                              <span className={`font-semibold ${
                                creditScore >= 750 ? 'text-green-600 dark:text-green-400' :
                                creditScore >= 650 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {creditScore}
                              </span>
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              loan.approvalStatus === "Approved" 
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                            }`}>
                              {loan.approvalStatus || "Pending"}
                            </span>
                          </td>
                          
                          <td className="px-4 py-4">
                            {adminStatus === "Pending" ? (
                              <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                Pending
                              </span>
                            ) : (
                              <span className="flex items-center text-green-600 dark:text-green-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                Approved
                              </span>
                            )}
                          </td>
                          
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-2">
                              {loan.documents?.panDoc ? (
                                <a
                                  href={`http://localhost:5000/uploads/${loan.documents.panDoc}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  📄 PAN
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">No PAN</span>
                              )}
                              {loan.documents?.salarySlip ? (
                                <a
                                  href={`http://localhost:5000/uploads/${loan.documents.salarySlip}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  💼 Salary
                                </a>
                              ) : (
                                <span className="text-gray-400 text-xs">No Salary</span>
                              )}
                            </div>
                          </td>
                          
                          <td className="px-4 py-4">
                            {adminStatus === "Pending" ? (
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => updateLoanStatus(loan._id, "Approved")}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => updateLoanStatus(loan._id, "Rejected")}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            ) : (
                              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg">
                                Finalized
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


function StatCard({ title, value, color, icon }) {
  const colorMap = {
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300",
  };

  return (
    <div className={`border rounded-xl p-5 transition-all hover:scale-[1.02] ${colorMap[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-2xl opacity-75">{icon}</div>
      </div>
    </div>
  );
}