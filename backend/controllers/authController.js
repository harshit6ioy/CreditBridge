const mockData = require("../mockData.json");
const calculateCreditScore = require("../utils/creditScore");
const Loan = require("../models/Loan");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = new Admin({ name, email, passwordHash });
  await admin.save();

  res.json({ message: "Admin created successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ message: "Login successful", token });
};


exports.verifyUser = (req, res) => {
  let { bankId, password } = req.body; // CHANGED: Now only needs bankId and password

  bankId = bankId?.toString().trim();
  password = password?.trim();

  if (!bankId || !password) {
    return res.status(400).json({
      success: false,
      message: "Bank ID and Password are required.",
    });
  }

  const idNumber = Number(bankId);

  
  const user = mockData.find(
    (u) => u.id === idNumber && u.password === password
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Bank ID or Password.",
    });
  }

  
  const { password: _, ...userWithoutPassword } = user;
  
  return res.json({
    success: true,
    message: "Login successful",
    user: userWithoutPassword,
  });
};


exports.applyLoan = async (req, res) => {
  try {
    let {
      bankId,
      panNumber,
      salary,
      requestedAmount,
      loanPurpose, 
      maritalStatus = "Single",
      age = 25,
      dependents = 0,
      phoneNumber,
      userName,
      userEmail,
    } = req.body;

   
    if (
      !bankId ||
      !panNumber ||
      !salary ||
      !requestedAmount ||
      !loanPurpose || 
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

    
    if (user.pan.toUpperCase() !== panNumber.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: "PAN mismatch with bank records.",
      });
    }

    
    const numericSalary = Number(salary);
    const numericRequestedAmount = Number(requestedAmount);

    if (numericSalary < Number(user.salary)) {
      return res.status(400).json({
        success: false,
        message: "Salary is below requirement.",
      });
    }

   
    const creditResult = calculateCreditScore(
      {
        requestedAmount: numericRequestedAmount,
        salary: numericSalary,
        maritalStatus,
        age: Number(age),
        dependents: Number(dependents),
        loanPurpose,
      },
      user
    );

    
    console.log("Credit Result:", {
      score: creditResult.score,
      rating: creditResult.rating,
      decision: creditResult.decision,
      hasBreakdown: !!creditResult.breakdown,
    });

    const systemDecision = creditResult.decision; // "Pre-Approved" or "Rejected"

    
    const validDecisions = ["Pre-Approved", "Rejected"];
    if (!validDecisions.includes(systemDecision)) {
      console.error(`Invalid decision from creditscore: ${systemDecision}`);
      return res.status(500).json({
        success: false,
        message: "System error: Invalid decision format.",
      });
    }

    
    const loan = new Loan({
      bankId: Number(bankId),
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      phoneNumber: phoneNumber.trim(),

      panNumber: panNumber.toUpperCase(),
      salary: numericSalary,
      requestedAmount: numericRequestedAmount,
      loanPurpose,
      maritalStatus,
      age: Number(age),
      dependents: Number(dependents),

      creditScore: creditResult.score,
      approvalStatus: systemDecision,
      adminFinalStatus: "Pending",

      documents: {
        panDoc,
        salarySlip,
      },
    });

    await loan.save();
    
    
    console.log("Loan saved successfully:", {
      id: loan._id,
      approvalStatus: loan.approvalStatus,
      creditScore: loan.creditScore,
    });

   
    return res.json({
      success: true,
      message: "Loan application submitted.",
      creditScore: creditResult.score,
      creditRating: creditResult.rating,
      systemDecision: creditResult.decision,
      scoreBreakdown: creditResult.breakdown,
      loanId: loan._id,
    });
  } catch (err) {
    console.error("APPLY LOAN ERROR →", err);
    
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: `Validation error: ${err.message}`,
        details: err.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};


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