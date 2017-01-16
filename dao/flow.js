'use strict';
const sequelize = require('../utils/sequelize_init');

var get_flow_id = async (affaid, next) => {
    let flow_id;
    await sequelize.query("select flow_id from WF_AFFAIR where affa_id='" + affaid + "'", {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        flow_id = data[0] ? data[0].flow_id : '';
    });
    return flow_id;
}

module.exports = {
    get_flow_id: get_flow_id
}