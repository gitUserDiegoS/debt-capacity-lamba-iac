function takeDecisition(newLoanPayment, availableCapacity, amount, salaryBase) {
  if (newLoanPayment > availableCapacity) {
    return "RECHAZADO";
  }
  if (amount > salaryBase * 5) {
    return "REVISION MANUAL";
  }
  return "APROBADO";
}

module.exports = { takeDecisition };
