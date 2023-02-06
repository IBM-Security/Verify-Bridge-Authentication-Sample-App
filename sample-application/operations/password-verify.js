
// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

/**
Request example:
{
  "enqueuedTime": "2022-10-10 05:01:02.58",
  "operation": "password-verify",
  "parameters": { "password": "scott11111", "username": "scott" },
  "requestedAttributes": ["displayName", "givenName", "SN"]
}

Response example:
{
  "operation": "password-verify",
  "status": { "result": "SUCCESS" },
  "parameters": {
    "groups": [
      { "name": "developer", "id": "608000GTNH" },
      { "name": "admin", "id": "608000GTNF" }
    ],
    "user": {
      "displayName": ["Scott"],
      "givenName": ["Scott"],
      "SN": ["Admin"]
    }
  }
}

 */

// Create the logger
const log                       = require('../utils/log')('Extauthn Web Service');

const respondLog = (responseBody, res) => {
    res.status(200).json(responseBody);
    log("Replied");
    log(JSON.stringify(responseBody));
}

/**
 * Handle the password-verify request
 * @param {Request}     req
 * @param {Response}    res
 * @param {any}         data_source
 */
const handlePasswordVerify = (req, res, data_source) => {
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
    const password              = parameters.password;

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

    // INVALID_PARAMETERS if password is missing from request
    if (!password) {
        respondLog({
            operation, 
            status: {
                result: "INVALID_PARAMETERS",
                message: "Password is missing from the request parameters"
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

    // INVALID_PARAMETERS if password fails verification
    if (password !== data_source[username].password) {
        respondLog({
            operation, 
            status: {
                result: "INVALID_PARAMETERS",
                message: "Password incorrect"
            }
        }, res);
        return;
    }

    const requestedAttributes   = req.body.requestedAttributes;

    // USER_ACCOUNT_LOCKED if user account is locked
    if (data_source[username].accountLocked) {
        respondLog({
            operation, 
            status: {
                result: "USER_ACCOUNT_LOCKED",
                message: "User account is locked"
            }
        }, res);
        return;
    }

    // PASSWORD_EXPIRED if user password has expired
    if (data_source[username].passwordExpired) {
        respondLog({
            operation, 
            status: {
                result: "PASSWORD_EXPIRED",
                message: "Password has expired"
            }
        }, res);
        return;
    }

    // Attributes exist in the data query
    let attributesExist;

    // Create the successful response
    let responseBody = {
        operation, 
        status: {
            result: "SUCCESS"
        },
        parameters: {
            groups: [],
            user: {

            }
        }
    }

     // Check if the requested attributes exist for the data query 
     if (requestedAttributes) {
        attributesExist = requestedAttributes.every(attribute => {
            return Object.keys(data_source[username]).includes(attribute);
        });
        
        // INVALID_PARAMETERS if requested attributes don't exist in the data source
        if (!attributesExist) {
            respondLog({
                operation, 
                status: {
                    result: "INVALID_PARAMETERS",
                    message: "Requested attribute(s) not found in data source"
                }
            }, res);
            return;
        }

        // Populate the successful response with the requested attributes
        requestedAttributes.forEach(attribute => {
            responseBody.parameters.user[attribute] = [ data_source[username][attribute] ]
        });
     }

     // Insert the groups into the response
     responseBody.parameters.groups = data_source[username].groups;
     
    // Return the successful response with the response code 200 as per the specification
    respondLog(responseBody, res);
}

module.exports = handlePasswordVerify;