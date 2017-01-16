'use strict';
const config = require('../config');
const Connection = require('tedious').Connection;

module.exports = new Connection({
    userName: config.username,
    password: config.password,
    server: config.host
});