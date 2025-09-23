const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { calculateMaxCapacity, calculateAvailableCapacity } = require("./services/capacityService");
const { calculateCurrentMonthlyFee } = require("./services/debtService");
const { calculateMonthlyFee, generatePaymentPlan } = require("./services/quotaService");
const { takeDecisition } = require("./services/decitionService");

const sqs = new SQSClient({ region: process.env.AWS_REGION }); 
const responseQueueUrl = process.env.RESPONSE_QUEUE_URL;

exports.handler = async (event) => {
  console.log("SQS event:", JSON.stringify(event));

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const { salaryBase, amount, rate, term, loans } = body;

      const maxCapacity = calculateMaxCapacity(salaryBase).toFixed(2);
      const currentDebt = calculateCurrentMonthlyFee(loans).toFixed(2);
      const availableCapacity = calculateAvailableCapacity(maxCapacity, currentDebt).toFixed(2);
      const newLoanPayment = calculateMonthlyFee(amount, rate, term).toFixed(2);
      const decition = takeDecisition(newLoanPayment, availableCapacity, amount, salaryBase);
      const paymentPlan = generatePaymentPlan(amount, rate, term);

      const message = {
        decition,
        maxCapacity,
        currentDebt,
        availableCapacity,
        newLoanPayment,
        paymentPlan,
      };

        // 4. Publicar en cola de respuestas
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: responseQueueUrl,
          MessageBody: JSON.stringify(message),
        })
      );

      console.log("Resultado publicado en SNS:", message);

    } catch (err) {
      console.error("Error procesando message:", err);
    }
  }

  return { statusCode: 200 };
};
