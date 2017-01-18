'use strict';
const sequelize = require('../utils/sequelize_init');

let find_affar = async (affa_id, next) => {
    let flow_id,json_data;
    await sequelize.query(`select flow_id,jsondata from WF_AFFAIR where affa_id='${affa_id}'`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        flow_id = data[0] ? data[0].flow_id : '';
        json_data = data[0] ? data[0].jsondata : '';
    });
    return {flow_id: flow_id,json_data: json_data};
}
let find_tasks = async (affa_id, next) => {
    let json_data = {};
    await sequelize.query(`select node_id,jsondata from WF_TASK where affa_id = '${affa_id}' and 
        node_id in ('R29FFCA438734A42AE6409144A1D78A3','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F')`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data){
        data.forEach(function(element){
            json_data[element.node_id] = JSON.parse(element.jsondata);
        });
    });
    return json_data;
}
let find_project_info = async (product_id, next) => {
    let product_info = {};
    await sequelize.query(`select REGITEM_NO,REGITEM_NAME from INTRUSTQLC..QLC_TITEMREGINFO where REGITEM_ID = 
        (select REGITEM_ID from INTRUSTQLC..qlc_tproduct where PRODUCT_ID=${product_id})`,{
        type: sequelize.QueryTypes.SELECT
    }).then(function(data){
        product_info['REGITEM_NO'] = data[0] ? data[0].REGITEM_NO : '';
        product_info['REGITEM_NAME'] = data[0] ? data[0].REGITEM_NAME : '';
    });
    return product_info;
}

module.exports = {
    find_affar: find_affar,
    find_tasks: find_tasks,
    find_project_info: find_project_info
}