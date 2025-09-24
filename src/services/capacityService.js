// risk control,max capacity should not be greather than 35% of salary base
function calculateMaxCapacity(salaryBase) {
  return salaryBase * 0.35;
}

// calculate avalilable capacity
function calculateAvailableCapacity(maxCapacity, actualDebt) {
  return maxCapacity - actualDebt;
}

module.exports = { calculateMaxCapacity, calculateAvailableCapacity };