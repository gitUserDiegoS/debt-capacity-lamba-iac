const {processAutomaticValidation} = require("./application/automaticValidation");
const { info, error } = require("./utils/logger");

//Entrypoint lambda handler 
exports.handler = async (event) => {
 
  info("SQS event received:", JSON.stringify(event));

  for (const record of event.Records) {
    try {

      const body = JSON.parse(record.body);
      await processAutomaticValidation(body);
      info("logger Result published in SQS");

    } catch (err) {
      error("Error processing message:", err);
    }
  }

  return { statusCode: 200 };
  
};
