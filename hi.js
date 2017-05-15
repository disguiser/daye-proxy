var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'myapp'});
log.info('hi 周明帅 %s', '周明帅', 'joe');