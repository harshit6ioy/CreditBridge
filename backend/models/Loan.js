const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    
    bankId: {
      type: Number,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    
    panNumber: {
      type: String,
      required: true,
      uppercase: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    requestedAmount: {
      type: Number,
      required: true,
    },

    loanPurpose: {
      type: String,
      enum: ["Education", "Medical", "Home", "Business", "Personal"],
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    dependents: {
      type: Number,
      required: true,
    },

    creditScore: {
      type: Number,
      required: true,
    },

    
    approvalStatus: {
      type: String,
      enum: ["Pre-Approved", "Rejected"],  
      required: true,
    },

    adminFinalStatus: {
      type: String,
      enum: ["Approved", "Rejected", "Pending"],
      default: "Pending",
    },

    
    documents: {
      panDoc: {
        type: String,
        required: true,
      },
      salarySlip: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Loan", loanSchema);