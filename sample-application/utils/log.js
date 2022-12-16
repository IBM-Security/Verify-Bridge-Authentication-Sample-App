// 
// Copyright contributors to the IBM Security Verify Bridge for Authentication Sample App project
// 

/**
 * Creates a logger that prefixes text
 * @param {any} prefix The text to write to console 
 */
 const createLogger = (prefix) => {
    const log = (text) => {
        console.log(`${prefix} | ${text}`);
    }

    return log;
};

module.exports = createLogger;