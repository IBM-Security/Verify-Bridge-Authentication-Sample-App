// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

/* get-status operation

Refresh configuration notification sample
{
  "addressedTo": "extauthn",
  "id": "0",
  "operation": "get-status"
}

Example of the response
{
  "replyFrom": "extauthn",
  "status": { "result": "SUCCESS" },
  "id": "0",
  "operation": "get-status",
  "connection": "OK"
}
*/

// Create the logger
const log                       = require('../utils/log')('Extauthn Web Service');

const handleGetStatus = (req, res) => {
  // Response to the get-status operation
  let responseBody = {
      "replyFrom": "extauthn",
      "status": {
          "result": "SUCCESS"
      }
  }

  responseBody.id             = req.body.id;          // The operation ID
  responseBody.operation      = req.body.operation;
  responseBody.connection     = "OK";

  // Send the get-status reply with status code 200 as per the specification
  res.status(200).json(responseBody);
  log("Replied:");
  log(JSON.stringify(responseBody));
}

module.exports = handleGetStatus;