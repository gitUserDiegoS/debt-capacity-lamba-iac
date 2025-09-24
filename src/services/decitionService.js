function takeDecisition(newLoanPayment, availableCapacity, amount, salaryBase) {
  console.log("Decision check:", {
    newLoanPayment,
    availableCapacity,
    salaryBase,
    amount,
  });

  if (newLoanPayment > availableCapacity) {
    return "REJECTED";
  }
  if (amount > salaryBase * 5) {
    return "MANUAL REVIEW";
  }
  return "APPROVED";
}

module.exports = { takeDecisition };
