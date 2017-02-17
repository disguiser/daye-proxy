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
    return {
        affa_id: affa_id,
        flow_id: flow_id,
        json_data: json_data
    };
}
let find_affar_by_taskid = async (task_id, next) => {
    let flow_id,
        affa_id,
        json_data;
    await sequelize.query(`select affa_id,flow_id,jsondata from WF_AFFAIR where affa_id=(select affa_id from WF_TASK where task_id='${task_id}')`, {
        type: sequelize.QueryTypes.SELECT
    }).then(function(data) {
        flow_id = data[0] ? data[0].flow_id : '';
        affa_id = data[0] ? data[0].affa_id : '';
        json_data = data[0] ? data[0].jsondata : '';
    });
    return {
        flow_id: flow_id,
        affa_id: affa_id,
        json_data: json_data
    };
}
let find_project_info_by_product_id = async (product_id, next) => {
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
let find_project_info_by_problem_id = async (problem_id, next) => {
    let product_info = {};
    await sequelize.query(`select REGITEM_NO from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=(select REGITEM_ID 
                        from INTRUSTQLC..QLC_TITEMPBINFO where problemid='${problem_id}')`,{
        type: sequelize.QueryTypes.SELECT
    }).then(function(data){
        product_info['REGITEM_NO'] = data[0] ? data[0].REGITEM_NO : '';
    });
    return product_info;
}

module.exports = {
    find_affar: find_affar,
    find_affar_by_taskid: find_affar_by_taskid,
    find_project_info_by_product_id: find_project_info_by_product_id,
    find_project_info_by_problem_id: find_project_info_by_problem_id
}