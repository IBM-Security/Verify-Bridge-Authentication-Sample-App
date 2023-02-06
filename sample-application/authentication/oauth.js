// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

// Use the logger
const log                       = require('../utils/log.js')(process.env.LOGGER_PREFIX);
const fetch                     = require('node-fetch');
/**
 * Oauth authentication middleware
 * @param {Request} req
 * @param {Response} res
 */
const oauth = async (req, res, next) => {
    log("Attempting OAuth Authentication");

    // Get the token from the header
    const authorizationHeader = req.headers.authorization;

    // Authorization header not found
    if (!authorizationHeader) {
        log("Authorization header not found");
        res.status(401).json();
    }

    // Extract bearer token from the authorization header
    const splitAuthHeader = authorizationHeader.split("Bearer ");
    if (!splitAuthHeader[1]) {
        log("Bearer token not found in authorization header");
        res.status(401).json();
    }

    // Get the token from the header
    const token = splitAuthHeader[1];

    const encodedParams = new URLSearchParams();

    encodedParams.set('client_id', process.env.OAUTH_CLIENT_ID);
    encodedParams.set('client_secret', process.env.OAUTH_CLIENT_SECRET);
    encodedParams.set('token', token);


    const url = process.env.OAUTH_INTROSPECT_URL;
    const options = {
    method: 'POST',
    headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
    },
    body: encodedParams
    };

    try {
        const fetchResult = await fetch(url, options);
        
        // Get the json response body
        const resultJson = await fetchResult.json();

        log('Introspect Result');
        console.log(resultJson);

        // Validate the introspect token
        if (resultJson.active) {
            log("Token valid oauth successful");
            next();
        } else {
            log("Token not active");
            res.status(401).json();
        }

    } catch  (err) {
        log('Error introspecting token: '+err)
    }
};

module.exports = oauth;