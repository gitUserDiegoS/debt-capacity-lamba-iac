const { info } = require("../utils/logger");


function takeDecisition(newLoanPayment, availableCapacity, amount, salaryBase) {
  info("logger Decition check: ", {
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
