/**
 * CREDIT SCORE CALCULATION
 * ------------------------------------
 * Base Score Range: 300 – 900
 * Decision Threshold: 500+
 *
 * Factors Considered:
 * 1. Loan amount vs salary
 * 2. Marital status
 * 3. Existing bank loans (mock data)
 * 4. Age
 * 5. Dependents
 */

const calculateCreditScore = (userForm, bankUser) => {
  let score = 300; // Base credit score

  const requestedAmount = Number(userForm.requestedAmount);
  const salary = Number(userForm.salary);
  const age = Number(userForm.age);
  const dependents = Number(userForm.dependents);
  const maritalStatus = userForm.maritalStatus;

  // --------------------------------------------------
  // 1. Loan Amount vs Salary Ratio
  // --------------------------------------------------
  const ratio = requestedAmount / salary;

  if (ratio <= 2) {
    score += 80; // Safe loan
  } else if (ratio <= 3) {
    score += 40; // Moderate risk
  } else {
    score -= 20; // High risk
  }

  // --------------------------------------------------
  // 2. Marital Status
  // --------------------------------------------------
  if (maritalStatus === "Married") {
    score += 30; // Higher stability
  }

  // --------------------------------------------------
  // 3. Existing Bank Loans (Mock Bank Records)
  // --------------------------------------------------
  if (
    Array.isArray(bankUser.existing_loans) &&
    bankUser.existing_loans.length > 0
  ) {
    score -= 50; // Already has loans
  } else {
    score += 30; // No prior liabilities
  }

  // --------------------------------------------------
  // 4. Age Factor
  // --------------------------------------------------
  if (age >= 25 && age <= 40) {
    score += 50; // Ideal earning age
  } else if (age < 25) {
    score += 20; // Early career
  } else {
    score -= 10; // Near retirement risk
  }

  // --------------------------------------------------
  // 5. Dependents
  // --------------------------------------------------
  if (dependents <= 2) {
    score += 20;
  } else if (dependents <= 4) {
    score += 10;
  } else {
    score -= 10;
  }

  // --------------------------------------------------
  // Final Score Limits
  // --------------------------------------------------
  if (score > 900) score = 900;
  if (score < 300) score = 300;

  return score;
};

module.exports = calculateCreditScore;
