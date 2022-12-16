// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

/**
* Example of an invalid operation response:

{
    "operation": "Invalid operation",
    "status": {
        "result": "ERROR",
        "message": "Invalid Operation"
    }
}

*/

// Create the logger
const log                       = require('../utils/log')('Extauthn Web Service');

/**
 * Handle requests with an invalid operation
 * @param {Request} req
 * @param {Response} res
 */
const handleInvalidOperation = (req, res) => {
    // Create the response body
    let responseBody = {
        operation: req.body.operation,
        status: {
            result: "ERROR",
        }
    }

    // Set status message
    responseBody.status.message = !req.body.operation ? "Operation missing from request" : "Invalid Operation";

    // Send the response with status code 200 as per specification
    res.status(200).json(responseBody);
    log("Replied:");
    log(JSON.stringify(responseBody));
}

module.exports = handleInvalidOperation;