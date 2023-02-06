// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

const jwt                       = require('jsonwebtoken');
const fs                        = require('fs');

// Use the logger
const log                       = require('../utils/log.js')(process.env.LOGGER_PREFIX);

// Implement Asymmetric JWT authentication
const asymmetricJwt = (req, res, next) => {
    // The values to be checked
    const CLIENT_CERTIFICATE = fs.readFileSync(process.env.ASYMMETRIC_JWT_PUBLIC_CERTIFICATE_PATH);
    const SUBJECT = process.env.ASYMMETRIC_JWT_SUBJECT;

    log("Attempting Asymmetric JWT Authentication...");
    // Get the token from the header
    const authorizationHeader = req.headers.authorization;

    // Error if auth header is missing
    if (!authorizationHeader) {
        log('Asymmetric JWT auth failed - no authorization header')
        res.status(401).json();
    }

    // Get the prefix from the environment var
    const PREFIX = process.env.ASYMMETRIC_JWT_PREFIX;
    let token;

    // If no prefix specified
    if (!PREFIX) {
        // Use the whole thing
        token = authorizationHeader;
    } else {
        // Get the token
        const authSplit = authorizationHeader.split(PREFIX);
        if (!authSplit[1]) {
            log(`Asymmetric JWT auth failed - Unable to split prefix '${PREFIX}' from header`);
            res.status(401).json();
        }

        token = authSplit[1];
    }

    

    log('Got Token:');
    log(token);

    try {
        jwt.verify(token, CLIENT_CERTIFICATE, { subject: SUBJECT, algorithms: [process.env.ASYMMETRIC_JWT_ALGORITHM] });
        log('Asymmetric JWT auth successful');
        next();
    } catch (err) {
        log(`Asymmetric JWT auth failed - ${err.name}, ${err.message}`);
        res.status(401).json();
    }
};

module.exports = asymmetricJwt;