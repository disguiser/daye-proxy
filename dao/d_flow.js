'use strict';
const sequelize = require('../utils/sequelize_init');

let find_affar = async (affa_id) => {
    let affair = await sequelize.query(`select flow_id,jsondata from WF_AFFAIR where affa_id='${affa_id}'`, {
        type: sequelize.QueryTypes.SELECT
    });
    return affair[0];
}
let find_affar_by_taskid = async (task_id) => {
    let data = await sequelize.query(`select affa_id,flow_id,jsondata from WF_AFFAIR where 
        affa_id=(select affa_id from WF_TASK where task_id='${task_id}')`, {
        type: sequelize.QueryTypes.SELECT
    });
    return data[0];
}
let find_project_info_by_product_id = async (product_id) => {
    let product_info = await sequelize.query(`select REGITEM_NO,REGITEM_NAME from INTRUSTQLC..QLC_TITEMREGINFO where REGITEM_ID = 
        (select REGITEM_ID from INTRUSTQLC..qlc_tproduct where PRODUCT_ID=${product_id})`,{
        type: sequelize.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_project_info_by_problem_id = async (problem_id) => {
    let product_info = await sequelize.query(`select REGITEM_NO from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=(select REGITEM_ID 
                        from INTRUSTQLC..QLC_TITEMPBINFO where problemid='${problem_id}')`,{
        type: sequelize.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_tasks = async (affa_id) => {
    let json_data = {};
    let data = await sequelize.query(`select node_id,jsondata from WF_TASK where affa_id = '${affa_id}' and 
        node_id in ('R29FFCA438734A42AE6409144A1D78A3','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F')`, {
        type: sequelize.QueryTypes.SELECT
    });
    data.forEach(function(element){
        json_data[element.node_id] = JSON.parse(element.jsondata);
    });
    return json_data;
}
module.exports = {
    find_affar: find_affar,
    find_affar_by_taskid: find_affar_by_taskid,
    find_tasks: find_tasks,
    find_project_info_by_product_id: find_project_info_by_product_id,
    find_project_info_by_problem_id: find_project_info_by_problem_id
}