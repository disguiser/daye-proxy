const Sequelize = require('sequelize');

const sequelize = require('../utils/sequelize_init').pjmain;

module.exports = sequelize.define('attachment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    flow_list_id: Sequelize.STRING(50),
    temp_id: Sequelize.STRING(50),
    file_name: Sequelize.STRING(50),
    file_path: Sequelize.STRING(100),
    file_size: Sequelize.STRING(20),
    upload_time: Sequelize.STRING(20)
}, {
        timestamps: false
    });