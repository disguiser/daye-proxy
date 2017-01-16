const Sequelize = require('sequelize');

const sequelize = require('../utils/sequelize_init');

module.exports = sequelize.define('attachment', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    flow_list_id: Sequelize.STRING(50),
    temp_id: Sequelize.STRING(50),
    file_name: Sequelize.STRING(50),
    file_path: Sequelize.STRING(100)
}, {
        timestamps: false
    });