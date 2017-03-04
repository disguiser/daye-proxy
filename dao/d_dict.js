'use strict';
const sequelize = require('../utils/sequelize_init');

let find_guarantor_dict = async (dict_id, next) => {
    let cust_name;
    await sequelize.query(`select CUST_NAME from QLC_TENTCUSTINFO where CUST_ID=${dict_id}`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        cust_name = data[0] ? data[0].CUST_NAME : '';
    });
    return cust_name;
}
module.exports = {
    find_guarantor_dict: find_guarantor_dict
}