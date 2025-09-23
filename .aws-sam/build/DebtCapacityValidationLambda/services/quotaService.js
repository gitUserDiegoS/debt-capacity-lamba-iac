// Fórmula de amortización (monthlyFee)
function calculateMonthlyFee(P, i, n) {
  return (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

// Plan de pago detallado
function generatePaymentPlan(P, i, n) {
  let balance = P;
  const plan = [];
  const monthlyFee = calculateMonthlyFee(P, i, n);

  for (let month = 1; month <= n; month++) {
    const rate = balance * i;
    const principalPayment = monthlyFee - rate;
    balance -= principalPayment;

    plan.push({
      month,
      monthlyFee: monthlyFee.toFixed(2),
      rate: rate.toFixed(2),
      principalPayment: principalPayment.toFixed(2),
      remininBalance: balance.toFixed(2),
    });
  }

  return plan;
}

module.exports = { calculateMonthlyFee, generatePaymentPlan };
