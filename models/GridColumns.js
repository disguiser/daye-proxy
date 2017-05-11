const Sequelize = require('sequelize');

const sequelize = require('../utils/sequelize_init').intrustqlc;

module.exports = sequelize.define('grid_columns', {
    primary_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    flow_id: Sequelize.STRING(50),
    id: Sequelize.STRING(6),
    cell: Sequelize.STRING(5),
    title: Sequelize.STRING(20),
    type: Sequelize.STRING(20),
    columnClass: Sequelize.STRING(20)
}, {
        freezeTableName: true,
        tableName: 'grid_columns',
        timestamps: false
    }
);