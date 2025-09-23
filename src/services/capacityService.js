// Capacidad máxima = 35% ingresos
function calculateMaxCapacity(salaryBase) {
  return salaryBase * 0.35;
}

// Capacidad disponible = máxima – deuda actual
function calculateAvailableCapacity(maxCapacity, actualDebt) {
  return maxCapacity - actualDebt;
}

module.exports = { calculateMaxCapacity, calculateAvailableCapacity };