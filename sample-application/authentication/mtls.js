// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

// Use the logger
const log                       = require('../utils/log.js')(process.env.LOGGER_PREFIX);


/**
 * MTLS authentication middleware
 * @param {Request} req
 * @param {Response} res
 */
const mtls = (req, res, next) => {
    // Log
    log("Attempting MTLS Authentication");

    if (req.client.authorized) {
        // Successful log
        log('MTLS auth successful');
        next();
    } else {
        log('MTLS auth failed')
        res.status(401).json();
    }
};

module.exports = mtls;