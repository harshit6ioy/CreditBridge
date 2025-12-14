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
      <div className="min-h-screen flex items-center justify-center
        bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        Loading...
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

      // ✅ USER DETAILS (FIXED KEYS)
      form.append("bankId", loanDetails.bankId);
      form.append("userName", loanDetails.name);
      form.append("userEmail", loanDetails.email);
      form.append("phoneNumber", loanDetails.phoneNumber);

      // LOAN DETAILS
      form.append("panNumber", loanDetails.panNumber);
      form.append("salary", loanDetails.salary);
      form.append("requestedAmount", loanDetails.requestedAmount);
      form.append("maritalStatus", loanDetails.maritalStatus);
      form.append("nationality", loanDetails.nationality);
      form.append("age", loanDetails.age);
      form.append("dependents", loanDetails.dependents);

      const res = await api.post("/apply-loan", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("loanStep1Data");

      setIsApproved(res.data.systemDecision === "Pre-Approved");
      setShowModal(true);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed");
    }

    setLoading(false);
  };

  // ---------------- UI (UNCHANGED) ----------------
  return (
    <>
      <div className="min-h-screen flex items-center justify-center
        bg-gradient-to-br from-gray-100 to-gray-200
        dark:from-gray-900 dark:to-gray-800 px-4">
        <EmiCalculatorButton />
        <ProfileIcon />

        <div className="w-full max-w-xl
          bg-white dark:bg-gray-800
          border border-gray-300 dark:border-gray-700
          rounded-3xl shadow-2xl p-8">

          <h1 className="text-3xl font-extrabold text-center
            text-black dark:text-white mb-2">
            Document Upload
          </h1>

          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            Upload the required documents to complete your loan application
          </p>

          <div className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">PAN Card</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setPanFile(e.target.files[0])}
                className="w-full p-3 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Salary Slip</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setSalarySlip(e.target.files[0])}
                className="w-full p-3 rounded-xl"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-blue-600 text-white font-bold"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl
            w-full max-w-md p-8 text-center">

            <div className={`text-7xl mb-4 ${
              isApproved ? "text-green-500" : "text-red-500"
            }`}>
              {isApproved ? "✔" : "✖"}
            </div>

            <h2 className="text-2xl font-extrabold mb-2">
              {isApproved ? "Congratulations!" : "Application Rejected"}
            </h2>

            <p className="mb-6">
              {isApproved
                ? "Your loan has been successfully pre-approved."
                : "Unfortunately, your loan could not be approved at this time."}
            </p>

            <button
              onClick={() => navigate(isApproved ? "/my-loans" : "/user")}
              className={`w-full py-3 rounded-xl text-white font-bold
                ${isApproved
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"}`}
            >
              {isApproved ? "Proceed to My Loans" : "Try Again Later"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
