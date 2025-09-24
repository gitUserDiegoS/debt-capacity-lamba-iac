const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const {
  calculateMaxCapacity,
  calculateAvailableCapacity,
} = require("./services/capacityService");
const { calculateCurrentMonthlyFee } = require("./services/debtService");
const {
  calculateMonthlyFee,
  generatePaymentPlan,
} = require("./services/quotaService");
const { takeDecisition } = require("./services/decitionService");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const responseQueueUrl = process.env.RESPONSE_QUEUE_URL;

exports.handler = async (event) => {
  console.log("SQS event:", JSON.stringify(event));

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const { salaryBase, amount, rate, term, loans } = body;

      const maxCapacity = calculateMaxCapacity(salaryBase);
      const currentDebt = calculateCurrentMonthlyFee(loans);
      const availableCapacity = calculateAvailableCapacity(maxCapacity,currentDebt);
      const newLoanPayment = calculateMonthlyFee(amount, rate, term);
      const decition = takeDecisition(newLoanPayment,availableCapacity,amount,salaryBase);
      const paymentPlan = generatePaymentPlan(amount, rate, term);

      const message = {
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

      //publish in response sqs
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: responseQueueUrl,
          MessageBody: JSON.stringify(message),
        })
      );

      console.log("Result published in SNS:", message);
    } catch (err) {
      console.error("Error processing message:", err);
    }
  }

  return { statusCode: 200 };
};
