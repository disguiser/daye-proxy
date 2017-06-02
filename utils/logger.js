const bunyan = require('bunyan');
const config = require('../config');
module.exports = bunyan.createLogger({
    name: 'daye',
    level: 'debug',
    src: true,
    streams: config.loggerStream
});