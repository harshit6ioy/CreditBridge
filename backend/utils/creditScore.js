// creditscore.js - MODIFIED VERSION FOR HIGHER SCORES

function calculateCreditScore(userForm, bankUser) {
  let totalScore = 500; // INCREASED from 300 to 500

  // Get values from form
  const loanAmount = Number(userForm.requestedAmount);
  const salary = Number(userForm.salary);
  const age = Number(userForm.age);
  const dependents = Number(userForm.dependents);
  const maritalStatus = userForm.maritalStatus;
  const loanPurpose = userForm.loanPurpose;

  // Store breakdown
  const breakdown = {
    baseScore: 500, // UPDATED to match
    factors: []
  };

  // 1. Check loan amount vs salary - INCREASED POINTS
  const ratio = loanAmount / salary;
  let factorScore = 0;
  let reason = "";
  
  if (ratio <= 1) {
    factorScore = 150; // INCREASED: Very low ratio
    reason = "Excellent: Loan amount is less than your salary";
  } else if (ratio <= 2) {
    factorScore = 100; // INCREASED from 80
    reason = "Good: Loan amount is less than 2 times your salary";
  } else if (ratio <= 3) {
    factorScore = 50; // INCREASED from 40
    reason = "Average: Loan amount is 2-3 times your salary";
  } else if (ratio <= 5) {
    factorScore = 10;
    reason = "Fair: Loan amount is 3-5 times your salary";
  } else {
    factorScore = -50; // More severe penalty
    reason = "Poor: Loan amount is more than 5 times your salary";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Loan vs Salary Ratio",
    score: factorScore,
    reason: reason
  });

  // 2. Check marital status - INCREASED
  factorScore = 0;
  reason = "";
  
  if (maritalStatus === "Married") {
    factorScore = 50; // INCREASED from 30
    reason = "Good: Married applicants are more stable";
  } else {
    factorScore = 20; // INCREASED from 0 (Single now gets points)
    reason = "Average: Single applicant";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Marital Status",
    score: factorScore,
    reason: reason
  });

  // 3. Check existing loans - INCREASED
  factorScore = 0;
  reason = "";
  const hasExistingLoans = bankUser.existing_loans && bankUser.existing_loans.length > 0;
  
  if (hasExistingLoans) {
    const loanCount = bankUser.existing_loans.length;
    if (loanCount === 1) {
      factorScore = -20; // Less severe for 1 loan
      reason = "Fair: You have 1 existing loan";
    } else {
      factorScore = -80; // INCREASED penalty for multiple loans
      reason = "Poor: You have multiple existing loans";
    }
  } else {
    factorScore = 60; // INCREASED from 30
    reason = "Excellent: No existing loans";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Existing Loans",
    score: factorScore,
    reason: reason
  });

  // 4. Check age - INCREASED
  factorScore = 0;
  reason = "";
  
  if (age >= 28 && age <= 45) {
    factorScore = 80; // INCREASED from 50 (Prime earning years)
    reason = "Excellent: Prime age for loans (28-45 years)";
  } else if (age >= 25 && age < 28) {
    factorScore = 50;
    reason = "Good: Young professional";
  } else if (age > 45 && age <= 60) {
    factorScore = 40;
    reason = "Good: Experienced professional";
  } else if (age < 25) {
    factorScore = 30; // INCREASED from 20
    reason = "Fair: Young but starting career";
  } else {
    factorScore = 10; // Less severe penalty
    reason = "Average: Approaching retirement";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Age Factor",
    score: factorScore,
    reason: reason
  });

  // 5. Check dependents - INCREASED
  factorScore = 0;
  reason = "";
  
  if (dependents === 0) {
    factorScore = 40; // INCREASED from 20
    reason = "Excellent: No dependents";
  } else if (dependents === 1) {
    factorScore = 30;
    reason = "Good: One dependent";
  } else if (dependents === 2) {
    factorScore = 20;
    reason = "Good: Two dependents";
  } else if (dependents <= 4) {
    factorScore = 10;
    reason = "Average: Moderate dependents";
  } else {
    factorScore = -30; // More severe penalty
    reason = "Poor: Many dependents";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Dependents",
    score: factorScore,
    reason: reason
  });

  // 6. Check loan purpose - INCREASED
  factorScore = 0;
  reason = "";
  
  if (loanPurpose === "Education") {
    factorScore = 80; // INCREASED from 40
    reason = "Excellent: Education loans have lowest risk";
  } else if (loanPurpose === "Home") {
    factorScore = 70; // INCREASED from 30
    reason = "Excellent: Home loans are secured and low risk";
  } else if (loanPurpose === "Medical") {
    factorScore = 60; // INCREASED from 20
    reason = "Good: Medical loans are necessary expenses";
  } else if (loanPurpose === "Business") {
    factorScore = 20; // Less penalty, now positive
    reason = "Average: Business loans have moderate risk";
  } else if (loanPurpose === "Personal") {
    factorScore = 10; // Less penalty, now positive
    reason = "Fair: Personal loans have higher risk";
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

  // 7. NEW: Salary range bonus
  factorScore = 0;
  reason = "";
  
  if (salary >= 200000) {
    factorScore = 100;
    reason = "Excellent: High income earner";
  } else if (salary >= 100000) {
    factorScore = 60;
    reason = "Good: Above average income";
  } else if (salary >= 50000) {
    factorScore = 30;
    reason = "Average: Moderate income";
  } else if (salary >= 30000) {
    factorScore = 10;
    reason = "Fair: Basic income";
  } else {
    factorScore = -20;
    reason = "Poor: Low income";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Income Level",
    score: factorScore,
    reason: reason
  });

  // 8. NEW: Employment stability (based on age)
  factorScore = 0;
  reason = "";
  
  if (age >= 30 && age <= 50) {
    factorScore = 50;
    reason = "Excellent: Most stable employment period";
  } else if ((age >= 25 && age < 30) || (age > 50 && age <= 60)) {
    factorScore = 30;
    reason = "Good: Stable employment";
  } else {
    factorScore = 10;
    reason = "Average: Less stable employment period";
  }
  
  totalScore += factorScore;
  breakdown.factors.push({
    name: "Employment Stability",
    score: factorScore,
    reason: reason
  });

  // Make sure score is between 300 and 900
  if (totalScore > 900) totalScore = 900;
  if (totalScore < 300) totalScore = 300;

  
  let rating = "";
  if (totalScore >= 700) rating = "Excellent";
  else if (totalScore >= 600) rating = "Good";
  else if (totalScore >= 500) rating = "Fair";
  else rating = "Poor";

  
  const isApproved = totalScore >= 500;
  const decision = isApproved ? "Pre-Approved" : "Rejected";

  
  return {
    score: totalScore,
    rating: rating,
    decision: decision,
    breakdown: breakdown
  };
}

module.exports = calculateCreditScore;