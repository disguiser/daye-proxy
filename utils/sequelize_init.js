'use strict';
const Sequelize = require('sequelize');
const config = require('../config').DB;

let pjmain = new Sequelize(config.PJMAIN, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
let intrustqlc = new Sequelize(config.INTRUSTQLC, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

module.exports = {
    pjmain: pjmain,
    intrustqlc: intrustqlc
}
