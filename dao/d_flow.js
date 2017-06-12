'use strict';
const pjmain = require('../utils/sequelize_init').pjmain;
const intrustqlc = require('../utils/sequelize_init').intrustqlc;

let find_affar = async (affa_id) => {
    let affair = await pjmain.query(`select affa_id,flow_id,jsondata from WF_AFFAIR where affa_id='${affa_id}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    return affair[0];
}
let find_affar_by_taskid = async (task_id) => {
    let data = await pjmain.query(`select a.affa_id,a.flow_id,a.jsondata,b.node_id from WF_AFFAIR a,WF_TASK b 
        where a.affa_id=b.affa_id and b.task_id='${task_id}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    return data[0];
}
let find_project_info = async (regitem_id) => {
    let project_info = await pjmain.query(`select REGITEM_CODE,REGITEM_NAME,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE from INTRUSTQLC..QLC_TITEMREGINFO 
        where REGITEM_ID = ${regitem_id}`,{
        type: pjmain.QueryTypes.SELECT
    });
    return project_info[0];
}
let find_product_info = async (regitem_id) => {
    let product_info = await pjmain.query(`select PRODUCT_CODE from INTRUSTQLC..qlc_tproduct
        where REGITEM_ID = ${regitem_id}`,{
        type: pjmain.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_account_info = async (account_id) => {
    let account_info = await pjmain.query(`select ACCT_BANK_NAME,ACCT_SUB_NAME,ACCT_BANK_ACCT from INTRUSTQLC..qlc_txtacctinfo
        where XTACCT_INTID = ${account_id}`,{
        type: pjmain.QueryTypes.SELECT
    });
    return account_info[0];
}
let find_project_info_by_product_id = async (product_id) => {
    let product_info = await pjmain.query(`select REGITEM_NO,REGITEM_NAME from INTRUSTQLC..QLC_TITEMREGINFO where REGITEM_ID = 
        (select REGITEM_ID from INTRUSTQLC..qlc_tproduct where PRODUCT_ID=${product_id})`,{
        type: pjmain.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_project_info_by_problem_id = async (problem_id) => {
    let product_info = await pjmain.query(`select REGITEM_NO,REGITEM_CODE,REGITEM_NAME,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=(select REGITEM_ID 
                        from INTRUSTQLC..QLC_TITEMPBINFO where problemid='${problem_id}')`,{
        type: pjmain.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_tasks = async (affa_id, node_ids) => {
    let json_data = {};
    let data = await pjmain.query(`select node_id,jsondata from WF_TASK where affa_id = '${affa_id}' and 
        node_id in (${node_ids})`, {
        type: pjmain.QueryTypes.SELECT
    });
    data.forEach(function(element){
        json_data[element.node_id] = JSON.parse(element.jsondata);
    });
    return json_data;
}
let find_bank_name = async (bank_id) => {
    let data = await intrustqlc.query(`select BANK_NAME from QLC_TCPACCTORG where BANK_ID = '${bank_id}'`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return data[0]['BANK_NAME'];
}
module.exports = {
    find_affar: find_affar,
    find_affar_by_taskid: find_affar_by_taskid,
    find_tasks: find_tasks,
    find_project_info: find_project_info,
    find_project_info_by_product_id: find_project_info_by_product_id,
    find_project_info_by_problem_id: find_project_info_by_problem_id,
    find_product_info: find_product_info,
    find_account_info:find_account_info,
    find_bank_name: find_bank_name
}