// creditscore.js - SIMPLE VERSION

function calculateCreditScore(userForm, bankUser) {
  let totalScore = 300; // Start with 300

  // Get values from form
  const loanAmount = Number(userForm.requestedAmount);
  const salary = Number(userForm.salary);
  const age = Number(userForm.age);
  const dependents = Number(userForm.dependents);
  const maritalStatus = userForm.maritalStatus;
  const loanPurpose = userForm.loanPurpose;

  // Store breakdown
  const breakdown = {
    baseScore: 300,
    factors: []
  };

  // 1. Check loan amount vs salary
  const ratio = loanAmount / salary;
  let factorScore = 0;
  let reason = "";
  
  if (ratio <= 2) {
    factorScore = 80;
    reason = "Good: Loan amount is less than 2 times your salary";
  } else if (ratio <= 3) {
    factorScore = 40;
    reason = "Average: Loan amount is 2-3 times your salary";
  } else {
    factorScore = -20;
    reason = "Poor: Loan amount is more than 3 times your salary";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Loan vs Salary",
    score: factorScore,
    reason: reason
  });

  // 2. Check marital status
  factorScore = 0;
  reason = "";
  
  if (maritalStatus === "Married") {
    factorScore = 30;
    reason = "Good: Married (more stable)";
  } else {
    factorScore = 0;
    reason = "Average: Single";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Marital Status",
    score: factorScore,
    reason: reason
  });

  // 3. Check existing loans
  factorScore = 0;
  reason = "";
  const hasExistingLoans = bankUser.existing_loans && bankUser.existing_loans.length > 0;
  
  if (hasExistingLoans) {
    factorScore = -50;
    reason = "Poor: You have existing loans";
  } else {
    factorScore = 30;
    reason = "Good: No existing loans";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Existing Loans",
    score: factorScore,
    reason: reason
  });

  // 4. Check age
  factorScore = 0;
  reason = "";
  
  if (age >= 25 && age <= 40) {
    factorScore = 50;
    reason = "Excellent: Best age for loans (25-40 years)";
  } else if (age < 25) {
    factorScore = 20;
    reason = "Good: Young but starting career";
  } else {
    factorScore = -10;
    reason = "Average: Higher risk age";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Age",
    score: factorScore,
    reason: reason
  });

  // 5. Check dependents
  factorScore = 0;
  reason = "";
  
  if (dependents <= 2) {
    factorScore = 20;
    reason = "Good: Few dependents";
  } else if (dependents <= 4) {
    factorScore = 10;
    reason = "Average: Moderate dependents";
  } else {
    factorScore = -10;
    reason = "Poor: Many dependents";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Dependents",
    score: factorScore,
    reason: reason
  });

  // 6. Check loan purpose
  factorScore = 0;
  reason = "";
  
  if (loanPurpose === "Education") {
    factorScore = 40;
    reason = "Excellent: Education loans are low risk";
  } else if (loanPurpose === "Medical") {
    factorScore = 20;
    reason = "Good: Medical loans are moderate risk";
  } else if (loanPurpose === "Home") {
    factorScore = 30;
    reason = "Good: Home loans are low risk";
  } else if (loanPurpose === "Business") {
    factorScore = -10;
    reason = "Poor: Business loans are high risk";
  } else if (loanPurpose === "Personal") {
    factorScore = -20;
    reason = "Poor: Personal loans are highest risk";
  } else {
    factorScore = 0;
    reason = "No specific purpose";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Loan Purpose",
    score: factorScore,
    reason: reason
  });

  // Make sure score is between 300 and 900
  if (totalScore > 900) totalScore = 900;
  if (totalScore < 300) totalScore = 300;

  // Get rating
  let rating = "";
  if (totalScore >= 700) rating = "Excellent";
  else if (totalScore >= 600) rating = "Good";
  else if (totalScore >= 500) rating = "Fair";
  else rating = "Poor";

  // Get decision
  const isApproved = totalScore >= 500;
  const decision = isApproved ? "Pre-Approved" : "Rejected";

  // Return result
  return {
    score: totalScore,
    rating: rating,
    decision: decision,
    breakdown: breakdown
  };
}

module.exports = calculateCreditScore;