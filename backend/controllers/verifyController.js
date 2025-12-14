const mockData = require("../mockData.json");
const calculateCreditScore = require("../utils/creditScore");
const Loan = require("../models/Loan");

// ------------------------------------------------------
// USER VERIFICATION (NO FILE UPLOAD HERE)
// ------------------------------------------------------
exports.verifyUser = (req, res) => {
  let { name, email, bankId } = req.body;

  name = name?.trim();
  email = email?.trim();
  bankId = bankId?.toString().trim();

  if (!name || !email || !bankId) {
    return res.status(400).json({
      success: false,
      message: "Name, Email, and Bank ID are required.",
    });
  }

  const idNumber = Number(bankId);

  const user = mockData.find(
    (u) =>
      u.id === idNumber &&
      u.name.toLowerCase() === name.toLowerCase() &&
      u.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found in bank records.",
    });
  }

  return res.json({
    success: true,
    message: "User verified successfully",
    user,
  });
};

// ------------------------------------------------------
// APPLY LOAN (REQUIRES FILE UPLOAD)
// ------------------------------------------------------
exports.applyLoan = async (req, res) => {
  try {
    let {
      bankId,
      panNumber,
      salary,
      requestedAmount,
      maritalStatus = "Single",
      age = 25,
      dependents = 0,
      phoneNumber,
      userName,
      userEmail,
    } = req.body;

    // ---------------- BASIC VALIDATION ----------------
    if (
      !bankId ||
      !panNumber ||
      !salary ||
      !requestedAmount ||
      !phoneNumber ||
      !userName ||
      !userEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    if (!req.files || !req.files.pan || !req.files.salarySlip) {
      return res.status(400).json({
        success: false,
        message: "PAN and Salary Slip are required.",
      });
    }

    const panDoc = req.files.pan[0].filename;
    const salarySlip = req.files.salarySlip[0].filename;

    const user = mockData.find((u) => u.id === Number(bankId));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in bank records.",
      });
    }

    // ---------------- PAN CHECK ----------------
    if (user.pan.toUpperCase() !== panNumber.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: "PAN mismatch with bank records.",
      });
    }

    // ---------------- SALARY CHECK ----------------
    const numericSalary = Number(salary);
    const numericRequestedAmount = Number(requestedAmount);

    if (numericSalary < Number(user.salary)) {
      return res.status(400).json({
        success: false,
        message: "Salary is below requirement.",
      });
    }

    // ---------------- CREDIT SCORE ----------------
    const creditScore = calculateCreditScore(
      {
        requestedAmount: numericRequestedAmount,
        salary: numericSalary,
        maritalStatus,
        age: Number(age),
        dependents: Number(dependents),
      },
      user
    );

    const systemDecision =
      creditScore >= 500 ? "Pre-Approved" : "Pre-Rejected";

    // ---------------- SAVE LOAN ----------------
    const loan = new Loan({
      bankId: Number(bankId),
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      phoneNumber: phoneNumber.trim(),

      panNumber: panNumber.toUpperCase(),
      salary: numericSalary,
      requestedAmount: numericRequestedAmount,
      maritalStatus,
      age: Number(age),
      dependents: Number(dependents),

      creditScore,
      approvalStatus: systemDecision,
      adminFinalStatus: "Pending",

      documents: {
        panDoc,
        salarySlip,
      },
    });

    await loan.save();

    return res.json({
      success: true,
      message: "Loan application submitted.",
      creditScore,
      systemDecision,
      loanId: loan._id,
    });
  } catch (err) {
    console.error("APPLY LOAN ERROR →", err);
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ------------------------------------------------------
// USER LOANS
// ------------------------------------------------------
exports.getUserLoans = async (req, res) => {
  try {
    const { bankId } = req.params;

    const loans = await Loan.find({ bankId: Number(bankId) }).sort({
      createdAt: -1,
    });

    return res.json(loans);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------------------------
// ADMIN FUNCTIONS
// ------------------------------------------------------
exports.adminUpdateLoan = async (req, res) => {
  const { decision } = req.body;

  if (!["Approved", "Rejected"].includes(decision)) {
    return res.json({ message: "Decision must be Approved or Rejected" });
  }

  const updatedLoan = await Loan.findByIdAndUpdate(
    req.params.id,
    { adminFinalStatus: decision },
    { new: true }
  );

  res.json({ message: "Updated", updatedLoan });
};

exports.getAllLoans = async (req, res) => {
  const loans = await Loan.find().sort({ createdAt: -1 });
  res.json(loans);
};

exports.getApprovedLoans = async (req, res) => {
  const loans = await Loan.find({ adminFinalStatus: "Approved" });
  res.json(loans);
};

exports.getRejectedLoans = async (req, res) => {
  const loans = await Loan.find({ adminFinalStatus: "Rejected" });
  res.json(loans);
};
