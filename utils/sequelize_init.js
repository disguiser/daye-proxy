'use strict';
const Sequelize = require('sequelize');
const config = require('../config').DB;

module.exports = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
