// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

const jwt                       = require('jsonwebtoken');

// Use the logger
const log                       = require('../utils/log.js')(process.env.LOGGER_PREFIX);

// Implement Symmetric JWT authentication
const symmetricJwt = (req, res, next) => {
    // The values to be checked
    const SECRET_KEY = process.env.SYMMETRIC_JWT_SECRET_KEY;
    const SUBJECT = process.env.SYMMETRIC_JWT_SUBJECT;

    log("Attempting Symmetric JWT Authentication");
    // Get the token from the header
    const authorizationHeader = req.headers.authorization;

    // Error if auth header is missing
    if (!authorizationHeader) {
        log('Symmetric JWT auth failed - no authorization header')
        res.status(401).json();
    }

    // Get the token
    const PREFIX = process.env.SYMMETRIC_JWT_PREFIX;
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
        jwt.verify(token, SECRET_KEY, { subject: SUBJECT });
        log('Symmetric JWT auth successful');
        next();
    } catch (err) {
        log(`Symmetric JWT auth failed - ${err.name}, ${err.message}`);
        res.status(401).json();
    }
};

module.exports = symmetricJwt;