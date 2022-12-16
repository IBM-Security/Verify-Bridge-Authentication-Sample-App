// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

/* password-change operation

Example Request:
{
  "enqueuedTime": "2022-10-10 05:06:42.872",
  "operation": "password-change",
  "parameters": {
    "newpassword": "newpassword11111",
    "oldpassword": "scott11111",
    "username": "scott"
  }
}

Example Response:
{"operation":"password-change","status":{"result":"SUCCESS"}}

*/

// Create the logger
const log                       = require('../utils/log')('Extauthn Web Service');

/**
 * Sends a json response with status code 200 and logs the response body to stdout
 * @param {any} responseBody
 * @param {Response} res
 * @returns {any}
 */
const respondLog = (responseBody, res) => {
    res.status(200).json(responseBody);
    log("Replied:");
    log(JSON.stringify(responseBody));
}

/**
 * Handle the password-change request
 * @param {Request}     req
 * @param {Response}    res
 * @param {any}         data_source
 */
const handlePasswordChange = (req, res, data_source) => {
    // Get the relevant properties from the request body
    const operation             = req.body.operation;
    const parameters            = req.body.parameters;

    // INVALID_PARAMETERS if the parameters property doesn't exist
    if (!parameters) {
        respondLog({
            operation, 
            status: {
                result: "INVALID_PARAMETERS",
                message: "Parameters property missing from request"
            }
        }, res);
        return;
    }

    // Get the parameters
    const username              = parameters.username;
    const newpassword           = parameters.newpassword;
    const oldpassword           = parameters.oldpassword;

    // INVALID_PARAMETERS if username missing from request
    if (!username) {
        respondLog({
            operation, 
            status: {
                result: "INVALID_PARAMETERS",
                message: "Username is missing from the request parameters"
            }
        }, res);
        return;
    }

    // INVALID_PARAMETERS if newpassword is missing from request
    if (!newpassword) {
        respondLog({
            operation, 
            status: {
                result: "INVALID_PARAMETERS",
                message: "New password is missing from the request parameters"
            }
        }, res);
        return;
    }

    // USER_NOT_FOUND if user doesn't exist in the datasource
    if (!data_source[username]) {
        respondLog({
            operation, 
            status: {
                result: "USER_NOT_FOUND",
                message: "User not found in data source"
            }
        }, res);
        return;
    }

    // PASSWORD_QUALITY if password isn't wrong enough
    const isFiveChars = /.{8}/.test(newpassword);
    const containsLetter = /.*[a-zA-Z].*/.test(newpassword);
    const containsNumber = /.*\d.*/.test(newpassword);
    if (!isFiveChars || !containsLetter || !containsNumber) {
        respondLog({
            operation, 
            status: {
                result: "PASSWORD_QUALITY",
                message: "Password must contain at least one letter, number and be at least 8 characters in length"
            }
        }, res);
        return;
    }

    if (oldpassword && (oldpassword === newpassword)) {
        respondLog({
            operation, 
            status: {
                result: "PASSWORD_QUALITY",
                message: "New password must not be equal to the new password"
            }
        }, res);
        return;
    }

    // Change the password in the data source
    data_source[username].password = newpassword;

    // Return a success message
    respondLog({
        operation, 
        status: {
            result: "SUCCESS",
        }
    }, res);

    return;

}

module.exports = handlePasswordChange;