// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

const basicAuth                 = require('basic-auth');

// Use the logger
const log                       = require('../utils/log.js')(process.env.LOGGER_PREFIX);

/**
 * Basic authentication middleware
 * @param {Request} req
 * @param {Response} res
 */
const basicAuthen = (req, res, next) => {
    // Log
    log("Attempting Basic Authentication");

    // Get the basic auth data from the request
    const credentials = basicAuth(req);
    log(`Basic Auth: ${JSON.stringify(credentials)}`);

    // Extract username and password from .env file
    const SERVER_USERNAME = process.env.BASIC_AUTH_USERNAME;
    const SERVER_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

    if (credentials 
        && credentials.name == SERVER_USERNAME 
        && credentials.pass == SERVER_PASSWORD) {
        // Successful log
        log('Basic auth succesful');
        next();
    } else {
        log('Basic auth failed')
        res.status(401).json();
    }
};

module.exports = basicAuthen;