'use strict';
const sequelize = require('../utils/sequelize_init').pjmain;

let find_guarantor_dict = async (dict_id, next) => {
    let cust_name;
    await sequelize.query(`select CUST_NAME from QLC_TENTCUSTINFO where CUST_ID=${dict_id}`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        cust_name = data[0] ? data[0].CUST_NAME : '';
    });
    return cust_name;
}
let get_contract_id = async (regitem_id, next) => {
    let contract_id = [];
    let data = await sequelize.query(`select DB_CONTRACT_ID from INTRUSTQLC..QLC_TASSURE_CONTRACT where 
                REGITEM_ID =${regitem_id} and isnull(ASSURE_BH,'')<>'' and ASSURE_TYPE in ('112603','112604')`, {
        type: sequelize.QueryTypes.SELECT
    });
    data.forEach(function(element){
        contract_id.push(element.DB_CONTRACT_ID);
    });
    return contract_id;
}
module.exports = {
    get_contract_id: get_contract_id
}