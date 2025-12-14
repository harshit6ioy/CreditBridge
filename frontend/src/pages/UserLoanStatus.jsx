import { useEffect, useState } from "react";
import api from "../api/api";
import ProfileIcon from "../components/ProfileIcon";
import EmiCalculatorButton from "../components/EmiCalculatorButton";

export default function UserLoanStatus() {
  const [loans, setLoans] = useState([]);
  const user = JSON.parse(localStorage.getItem("verifiedUser"));

  useEffect(() => {
    async function fetchUserLoans() {
      try {
        const res = await api.get(`/user-loans/${user.id}`);
        setLoans(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    if (user?.id) {
      fetchUserLoans();
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <EmiCalculatorButton />
      <ProfileIcon />
      <h1 className="text-4xl font-extrabold text-center
        text-black dark:text-white mb-8">
        My Loan Applications
      </h1>

      <div className="max-w-5xl mx-auto
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-700
        rounded-3xl shadow-2xl p-6">

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700
              text-black dark:text-white font-bold text-lg">
              <th className="p-4 text-left">Loan Amount</th>
              <th className="p-4 text-left">Credit Score</th>
              <th className="p-4 text-left">System Status</th>
              <th className="p-4 text-left">Final Decision</th>
            </tr>
          </thead>

          <tbody>
            {loans.map((loan) => (
              <tr
                key={loan._id}
                className="border-b border-gray-200 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition text-black dark:text-white"
              >
                <td className="p-4 font-semibold">
                  ₹{loan.requestedAmount.toLocaleString()}
                </td>

                <td className="p-4">{loan.creditScore}</td>

                <td className="p-4 font-semibold">
                  {loan.approvalStatus}
                </td>

                <td className="p-4 font-bold text-lg">
                  {loan.adminFinalStatus === "Approved" && (
                    <span className="flex items-center gap-2
                      text-green-600 dark:text-green-400">
                      ✔ Approved
                    </span>
                  )}

                  {loan.adminFinalStatus === "Rejected" && (
                    <span className="flex items-center gap-2
                      text-red-600 dark:text-red-400">
                      ✖ Rejected
                    </span>
                  )}

                  {loan.adminFinalStatus === "Pending" && (
                    <span className="flex items-center gap-2
                      text-yellow-500 dark:text-yellow-400">
                      ⏳ Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loans.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg font-semibold
              text-gray-600 dark:text-gray-400">
              No loan applications found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
