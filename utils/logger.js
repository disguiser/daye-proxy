const bunyan = require('bunyan');
module.exports = bunyan.createLogger({
    name: 'daye',
    level: 'debug',
    src: true,
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        },
        {
            level: 'error',
            path: 'E:/64workspace/VS/daye/log/error.log'
        }
    ]
});