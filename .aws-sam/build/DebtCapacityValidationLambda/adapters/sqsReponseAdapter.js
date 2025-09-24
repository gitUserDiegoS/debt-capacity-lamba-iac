const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { info } = require("../utils/logger");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const responseQueueUrl = process.env.RESPONSE_QUEUE_URL;

async function publishResponse(message) {
  await sqs.send(
    new SendMessageCommand({
      QueueUrl: responseQueueUrl,
      MessageBody: JSON.stringify(message),
    })
  );
  info("Result published in sqs reponse:", message);

}

module.exports = { publishResponse };
