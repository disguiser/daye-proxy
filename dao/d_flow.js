'use strict';
const pjmain = require('../utils/sequelize_init').pjmain;
const intrustqlc = require('../utils/sequelize_init').intrustqlc;
const enfota = require('../utils/sequelize_init').enfota;

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
    let project_info = await pjmain.query(`select CPSTART_DATE,REGITEM_CODE,REGITEM_NAME,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE from INTRUSTQLC..QLC_TITEMREGINFO 
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
    let account_info = await pjmain.query(`select ACCT_ACCT_NAME,ISNULL(ACCT_BANK_NAME,'')+ISNULL(ACCT_SUB_NAME,'') as ACCT_BANK_NAME,ACCT_BANK_ACCT from INTRUSTQLC..qlc_txtacctinfo
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
    let product_info = await pjmain.query(`select REGITEM_NO,REGITEM_CODE,REGITEM_NAME,(case when type1='1' then '单一' when type1='2' then '集合' else '财产' end)+(case when SFSW=1 then '事务类' else '非事务类' end)+'('+type3_name+')' as REGITEM_TYPE,'('+cast(Convert(decimal(18,2),pre_money/10000) as nvarchar)+'万元)('+cast(CPSTART_PERIOD as nvarchar)+'月)' as TERMANDSUM,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE,JHBZCS,XMHKLY,BJSYHKSJ,TQFS_ZFSJ,XTCDFY,FY_SP_SJ,RISK_CONTROL,FXKZ_INFO,TJFS_INFO,TZFW_INFO,TZCL_INFO,TZBL_INFO from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=(select REGITEM_ID 
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
let find_pay_apply = async (affa_id) => {
    let data = await intrustqlc.query(`select DJ_CODE,REGITEM_NAME,PROV_LEVEL_NAME,FK_BANK_NAME,SK_BANK_NAME,SK_BANK_ACCT,CUST_NAME,CONVERT(varchar(10),INPUT_TIME,120) as APPLY_DATE,
    FK_BANK_SUB_NAME,SK_BANK_ACCT,PAY_MONEY,REMARK1,PROV_LEVEL,case when PROV_LEVEL='191203' then DKCD_MONEY else PAY_MONEY end as DKCD_MONEY,FK_ACCT_ID,IS_DD,REFUND_DATE,FK_BANK_ACCT,INPUT_TIME,INPUT_MAN_NAME,
    (select a.dept_name from pjmain..org_dept a,pjmain..org_user b where a.dept_code=b.dept_code and b.user_code=QLC_TPAYAPPLY.INPUT_MAN) as DEPT_NAME,
    (select param_name from qlc_txtacctinfo a,QLC_TINTPARAM b where b.param_value = a.REMIT_TYPE and a.XTACCT_INTID=QLC_TPAYAPPLY.FK_ACCT_ID) as REMIT_NAME
     from QLC_TPAYAPPLY where problem_id='${affa_id}'`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return data[0];
}
let find_regitem_id_by_affaid = async (affa_id) => {
    let regitem_id = await intrustqlc.query(`select REGITEM_ID from QLC_TITEMPBINFO where PROBLEMID = '${affa_id}'` ,{
        type: intrustqlc.QueryTypes.SELECT
    });
    return regitem_id[0]['REGITEM_ID'];
}
let find_regitem_id_by_taskid = async (task_id) => {
    let regitem_id = await intrustqlc.query(`select REGITEM_ID from QLC_TITEMPBINFO where PROBLEMID = (select affa_id from PJMAIN..WF_TASK where task_id='${task_id}')` ,{
        type: intrustqlc.QueryTypes.SELECT
    });
    return regitem_id[0]['REGITEM_ID'];
}
let find_asst_name = async (ASSET_MONEYS) => {
    let datas = await intrustqlc.query(`select A.ASSET_ID AS ASSET_ID,B.ASSURE_BH+'-'+A.ASSET_NO+'-'+A.ASSET_NAME AS ASSET_NAME from QLC_TASSET A,QLC_TASSURE_CONTRACT B,QLC_TCOLLATERAL C where A.ASSET_UUID = C.ASSET_UUID and C.ASSURE_UUID = B.ASSURE_UUID and A.ASSET_ID in (${ASSET_MONEYS})`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    let new_datas = {};
    datas.forEach(e => {
        new_datas[e.ASSET_ID] = e.ASSET_NAME;
    });
    return new_datas;
}
let find_cb = async (ASSET_ID) => {
    let datas = await intrustqlc.query(`select CONTRACT_BH+'-'+cast(ADD_SUM as varchar)+'-'+CUST_NAME cb from QLC_TCONTRACT_SUPPLY where CONTRACT_BH='${ASSET_ID}'`,{
        type: enfota.QueryTypes.SELECT
    });
    return datas[0];
}
let find_bank_name_ta = async (bank_id) => {
    let bank_name = await enfota.query(`select BANK_NAME from TA_VCPACCTORG where BANK_ID='${bank_id}'`, {
        type: enfota.QueryTypes.SELECT
    });
    return bank_name[0]['BANK_NAME'];
}
let find_cust_name = async (cust_id) => {
    let cust_name = await enfota.query(`select cust_name from TA_TCUSTMAININFO where cust_id='${cust_id}'`, {
        type: enfota.QueryTypes.SELECT
    });
    return cust_name[0]['cust_name'];
}
let find_apprpvalsela = async (affa_id,regitem_id) => {
    let seal_type_name = await intrustqlc.query(`select FILE_NAME,NUMBER,SEAL_TYPE_NAME,SPECAL_CHAPTER from QLC_APPROVAL_SEAL where 
    problem_id='${affa_id}' and REGITEM_ID=${regitem_id}`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return seal_type_name;
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
    find_bank_name: find_bank_name,
    find_pay_apply: find_pay_apply,
    find_regitem_id_by_affaid: find_regitem_id_by_affaid,
    find_regitem_id_by_taskid: find_regitem_id_by_taskid,
    find_asst_name: find_asst_name,
    find_cb: find_cb,
    find_bank_name_ta: find_bank_name_ta,
    find_cust_name: find_cust_name,
    find_apprpvalsela: find_apprpvalsela
}