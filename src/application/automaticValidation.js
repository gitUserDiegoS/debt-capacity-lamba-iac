const { info } = require("../utils/logger");
const {calculateMaxCapacity,calculateAvailableCapacity} = require("../domain/capacityOperation");
const { calculateCurrentMonthlyFee } = require("../domain/debtOperaction");
const {calculateMonthlyFee,generatePaymentPlan} = require("../domain/paymentPlanResult");
const { takeDecisition } = require("../domain/decitionResult");
const { publishResponse } = require("../adapters/sqsReponseAdapter");

//logic orchestator 
async function processAutomaticValidation({
  idApplication,
  salaryBase,
  amount,
  rate,
  term,
  loans,
}) {
  info("Processing application", {idApplication, salaryBase, amount, rate, term });

  const maxCapacity = calculateMaxCapacity(salaryBase);
  const currentDebt = calculateCurrentMonthlyFee(loans);
  const availableCapacity = calculateAvailableCapacity(
    maxCapacity,
    currentDebt
  );
  const newLoanPayment = calculateMonthlyFee(amount, rate, term);
  const decition = takeDecisition(
    newLoanPayment,
    availableCapacity,
    amount,
    salaryBase
  );
  const paymentPlan = generatePaymentPlan(amount, rate, term);

  const message = {
    idApplication,
    decition,
    maxCapacity: maxCapacity.toFixed(2),
    currentDebt: currentDebt.toFixed(2),
    availableCapacity: availableCapacity.toFixed(2),
    newLoanPayment: newLoanPayment.toFixed(2),
    paymentPlan: paymentPlan.map((p) => ({
      month: p.month,
      monthlyFee: p.monthlyFee.toFixed(2),
      rate: p.rate.toFixed(2),
      principalPayment: p.principalPayment.toFixed(2),
      remininBalance: p.remininBalance.toFixed(2),
    })),
  };
  await publishResponse(message);
}
module.exports = { processAutomaticValidation };
