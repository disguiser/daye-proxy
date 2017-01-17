'use strict';
const sequelize = require('../utils/sequelize_init');

let find_by_affa_id = async (affa_id, next) => {
    let flow_id,json_data;
    await sequelize.query(`select flow_id,jsondata from WF_AFFAIR where affa_id='${affa_id}'`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        flow_id = data[0] ? data[0].flow_id : '';
        json_data = data[0] ? data[0].jsondata : '';
    });
    return {flow_id: flow_id,json_data: json_data};
}

module.exports = {
    find_by_affa_id: find_by_affa_id
}