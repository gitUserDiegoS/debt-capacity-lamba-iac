const { toMonthlyRate } = require("../utils/rateAnualToMonth");


// calculate monthlyFee
function calculateMonthlyFee(amount, rate, term) {
  
    const monthlyRate = toMonthlyRate (rate);

     if (monthlyRate === 0) {
    return amount / termMonths;
  }

  return (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
}

// return the payment Plan according to the term, amount and monthlyRate
function generatePaymentPlan(amount, rate, term) {

  const monthlyRate = toMonthlyRate (rate);
  const monthlyFee = calculateMonthlyFee(amount, rate, term);


  let balance = amount;
  const plan = [];

  for (let month = 1; month <= term; month++) {
    const rate = balance * monthlyRate;
    const principalPayment = monthlyFee - rate;
    balance -= principalPayment;

    plan.push({
      month,
      monthlyFee: monthlyFee,
      rate: rate,
      principalPayment: principalPayment,
      remininBalance: balance>0?balance:0.00,
    });
  }

  return plan;
}

module.exports = { calculateMonthlyFee, generatePaymentPlan };
