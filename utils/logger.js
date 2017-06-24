const winston = require('winston');
const log_config = require('../config').log_config;
const moment = require('moment');
module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: 'all',
            level: log_config.console_level,
            timestamp: () => {
                return moment().format('\\[YYYY-MM-DD h:mm:ss\\]');
            }
        }), 
        new (winston.transports.File)({
            filename: log_config.error_path,
            level: 'error',
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ],
    exitOnError: false
});