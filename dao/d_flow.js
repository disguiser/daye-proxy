'use strict';
const pjmain = require('../utils/sequelize_init').pjmain;
const intrustqlc = require('../utils/sequelize_init').intrustqlc;
const enfota = require('../utils/sequelize_init').enfota;
const dfs = require('../utils/sequelize_init').dfs;

let find_affar = async (affa_id) => {
    let affair = await pjmain.query(`select A.affa_id,A.flow_id,A.jsondata,A.cur_version,A.create_time,B.full_name as create_user,C.dept_name as create_dept from WF_AFFAIR A,org_user B,org_dept C where A.affa_id='${affa_id}' and  A.create_user=B.user_code and B.dept_code=C.dept_code`, {
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
    let project_info = await intrustqlc.query(`select CPSTART_DATE,REGITEM_CODE,REGITEM_NAME,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE,TYPE1,TYPE3,OPER_MANAGER_NAME2,GNFL,PRE_MONEY from QLC_TITEMREGINFO 
        where REGITEM_ID = ${regitem_id}`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return project_info[0];
}
let find_sign_name_by_affaid = async (affa_id) => {
    let sign_info = await intrustqlc.query(`select SIGN_MEMBER_NAME from QLC_TSIGN_CHANGE  where PROBLEM_ID = '${affa_id}'`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return sign_info[0];
}
let find_assetname_by_assetid = async (asset_id) => {
    let asset_info = await intrustqlc.query(`select  A.ASSET_ID,C.CONTRACT_BH+'|'+B.ASSURE_BH+'|抵押物名称:'+A.ASSET_NAME+'|评估总价:'+str(isnull(A.APP_MONEY,0))+'元|剩余价值:'+str(isnull(A.BALANCE_MONEY,0))+'元' ASSETINFO  from INTRUSTQLC..QLC_TASSET A,INTRUSTQLC..QLC_TASSURE_CONTRACT B,INTRUSTQLC..QLC_TCONTRACT C  WHERE A.DB_CONTRACT_ID=B.DB_CONTRACT_ID and B.CONTRACT_ID=C.CONTRACT_ID and A.ASSET_ID in (${asset_id})`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    let new_datas = {};
    asset_info.forEach(e => {
        new_datas[e.ASSET_ID] = e.ASSETINFO;
    });
    return new_datas;
}
//2018-3-14在取数中多取了PRODUCT_NAME
let find_product_info = async (regitem_id) => {
    let product_info = await pjmain.query(`select PRODUCT_CODE,PRODUCT_NAME from INTRUSTQLC..qlc_tproduct
        where REGITEM_ID = ${regitem_id}`, {
        type: pjmain.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_account_info = async (account_id) => {
    let account_info = await pjmain.query(`select ACCT_ACCT_NAME,ISNULL(ACCT_BANK_NAME,'')+ISNULL(ACCT_SUB_NAME,'') as ACCT_BANK_NAME,ACCT_BANK_ACCT from INTRUSTQLC..qlc_txtacctinfo
        where XTACCT_INTID = ${account_id}`, {
        type: pjmain.QueryTypes.SELECT
    });
    return account_info[0];
}
let find_project_info_by_product_id = async (product_id) => {
    let product_info = await pjmain.query(`select REGITEM_NO,REGITEM_NAME from INTRUSTQLC..QLC_TITEMREGINFO where REGITEM_ID = 
        (select REGITEM_ID from INTRUSTQLC..qlc_tproduct where PRODUCT_ID=${product_id})`, {
        type: pjmain.QueryTypes.SELECT
    });
    return product_info[0];
}
let find_project_info_by_problem_id = async (problem_id) => {
    let product_info = await pjmain.query(`select REGITEM_NO,REGITEM_CODE,REGITEM_NAME,(case when type1='1' then '单一' when type1='2' then '集合' else '财产' end)+(case when SFSW=1 then '事务类' else '非事务类' end)+'('+type3_name+')' as REGITEM_TYPE,'('+cast(Convert(decimal(18,2),pre_money/10000) as nvarchar)+'万元)('+cast(CPSTART_PERIOD as nvarchar)+'月)' as TERMANDSUM,REGITEM_DP_NAME,REGITEM_OP_NAME,APPLY_DATE,JHBZCS,XMHKLY,BJSYHKSJ,TQFS_ZFSJ,XTCDFY,FY_SP_SJ,RISK_CONTROL,FXKZ_INFO,TJFS_INFO,TZFW_INFO,TZCL_INFO,TZBL_INFO,SFYD,TYPE1,TYPE3,PRE_MONEY,OPER_MANAGER_NAME2 from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=(select REGITEM_ID 
                        from INTRUSTQLC..QLC_TITEMPBINFO where problemid='${problem_id}')`, {
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
    data.forEach(function (element) {
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
let find_supply_info = async (affa_id) => {
    let data = await intrustqlc.query(`select DJ_CODE from QLC_TCONTRACT_SUPPLY where problem_id='${affa_id}'`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return data[0];
}
let find_regitem_id_by_affaid = async (affa_id) => {
    let regitem_id = await intrustqlc.query(`select REGITEM_ID from QLC_TITEMPBINFO where PROBLEMID = '${affa_id}'`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return regitem_id[0]['REGITEM_ID'];
}
let find_regitem_id_by_taskid = async (task_id) => {
    let regitem_id = await intrustqlc.query(`select REGITEM_ID from QLC_TITEMPBINFO where PROBLEMID = (select affa_id from PJMAIN..WF_TASK where task_id='${task_id}')`, {
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
    let datas = await intrustqlc.query(`select CONTRACT_NAME+'-'+cast(ADD_SUM as varchar)+'-'+CUST_NAME cb from QLC_TCONTRACT_SUPPLY where CONTRACT_BH='${ASSET_ID}'`, {
        type: enfota.QueryTypes.SELECT
    });
    return datas[0];
}
//2018-3-14在TA_VCPACCTORG表名前添加ENFOTA..
let find_bank_name_ta = async (bank_id) => {
    let bank_name = await enfota.query(`select BANK_NAME from ENFOTA..TA_VCPACCTORG where BANK_ID='${bank_id}'`, {
        type: enfota.QueryTypes.SELECT
    });
    return bank_name[0]['BANK_NAME'];
}
//2018-3-14在TA_TCUSTMAININFO表名前添加ENFOTA..
let find_cust_name = async (cust_id) => {
    let cust_name = await enfota.query(`select cust_name from ENFOTA..TA_TCUSTMAININFO where cust_id='${cust_id}'`, {
        type: enfota.QueryTypes.SELECT
    });
    return cust_name[0]['cust_name'];
}
let find_apprpvalsela = async (affa_id, regitem_id) => {
    let seal_type_name = await intrustqlc.query(`select YYXH,FILE_NAME,NUMBER,SEAL_TYPE_NAME,SPECAL_CHAPTER from QLC_APPROVAL_SEAL where 
    problem_id='${affa_id}' and REGITEM_ID=${regitem_id} order by YYXH`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return seal_type_name;
}
let find_affairnumber = async (affa_id) => {
    let affanumber = await intrustqlc.query(`select count(1) from V_QLC_ITEMPBINFO where AFFA_ID in 
    (select FOR_AFFA_ID from QLC_ASSOCIATED_PROCESS where AFFA_ID='${affa_id}' or AFFA_ID in  (select affa_id from PJMAIN..WF_TASK where task_id='${affa_id}'))`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return affanumber;
}
let find_affanumber_by_taskid = async (task_id) => {
    let affanumber = await intrustqlc.query(`select count(1) AS NUMBER from INTRUSTQLC..QLC_ASSOCIATED_PROCESS where AFFA_ID='${task_id}' or AFFA_ID in  (select affa_id from PJMAIN..WF_TASK where task_id='${task_id}')`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    console.log(affanumber);
    console.log(affanumber[0]['NUMBER']);
    return affanumber[0]['NUMBER'];
}
let find_affanumber_by_affaid = async (affa_id) => {
    let affanumber = await intrustqlc.query(`select count(1) AS NUMBER  from INTRUSTQLC..QLC_ASSOCIATED_PROCESS where AFFA_ID='${affa_id}' or AFFA_ID in  (select affa_id from PJMAIN..WF_TASK where task_id='${affa_id}')`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    console.log(affanumber);
    console.log(affanumber[0]['NUMBER']);
    return affanumber[0]['NUMBER'];
}
let find_taskinfo = async (affa_id, node_id) => {
    let data = await pjmain.query(`select A.task_id,A.affa_id,A.flow_id,A.assignto,A.jsondata,A.create_time,A.exec_user,A.exec_time,A.read_time,replace(replace(A.summary,'<p>',''),'</p>','') AS summary, B.full_name from WF_TASK A left join org_user B on A.exec_user=B.user_code where A.tstatus = 2 and A.affa_id = '${affa_id}' and A.node_id = '${node_id}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        console.log(data);
        console.log("-------exec_time-------");
        console.log(data[0]['exec_time']);
        return data[0];
    } else {
        return '';
    }
}
let find_taskinfonumber = async (affa_id, node_id) => {
    let data = await pjmain.query(`select task_id,affa_id,flow_id,assignto,jsondata,create_time,exec_user,exec_time,read_time,summary,tstatus from WF_TASK where  affa_id = '${affa_id}' and node_id = '${node_id}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        return '';
    }
}

let find_twarrants_transfer_list_info = async (affa_id) => {
    let list = await intrustqlc.query(`select TRANS_NO,WARRANT_NAME,WARRANT_NO,NUMBER,REMARK,FJ_UUID,SFGH,REASON from QLC_TWARRANTS_TRANSFER_LIST where PROBLEM_ID='${affa_id}'  order by LIST_ID`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return list;
}

let find_twarrants_transfer_info = async (affa_id) => {
    let data = await intrustqlc.query(`select REGITEM_NAME,REGITEM_CODE,TRANS_DATE,TRANS_ITEM,REMARK,ZR_MANAGER_NAME,INPUT_DEPT_NAME from QLC_TWARRANTS_TRANSFER where  PROBLEM_ID = '${affa_id}'  `, {
        type: intrustqlc.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        return '';
    }
}
let find_customer_contration_info = async (affa_id) => {
    let data = await intrustqlc.query(`select REGITEM_NAME,CUST_NAME,GRADE_BEFORE,QUOTA_BEFORE,GRADE_NOW,QUOTA_NOW,JZD_NOW,REMARK,REGITEM_MONEY,LJ_MONEY,ZY_MONEY,GRADE_DATE from QLC_TCUSTOMER_CONCENTRATION_DAY where PROBLEM_ID = '${affa_id}' `, {
        type: intrustqlc.QueryTypes.SELECT
    });
    if (data.length > 0) {
        console.log(data);
        console.log("-------find_customer_contration_info-------");
        return data[0];
    } else {
        return '';
    }
}
let find_file_archive_list_info = async (affa_id) => {
    let list = await intrustqlc.query(`select LIST_NO,FILE_NAME,IF_ORIGINAL,NUMBER,REMARK,FJ_UUID from QLC_TFILE_ARCHIVE_LIST where PROBLEM_ID='${affa_id}'  order by LIST_ID`, {
        type: intrustqlc.QueryTypes.SELECT
    });
    return list;
}

let find_file_archive_info = async (affa_id) => {
    let data = await intrustqlc.query(`select REGITEM_NAME,REGITEM_CODE,ARCHIVE_DATE,IF_RECTIFY,IF_RECTIFY_OK,REMARK,INPUT_MAN_NAME,INPUT_DEPT_NAME from QLC_TFILE_ARCHIVE where  PROBLEM_ID = '${affa_id}'  `, {
        type: intrustqlc.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        return '';
    }
}
let find_task_summer_for_huiq = async (affa_id, node_id) => {
    let data = await pjmain.query(`select task_id,affa_id,flow_id,assignto,jsondata,create_time,exec_user,exec_time,read_time,summary,tstatus from WF_TASK where  affa_id = '${affa_id}' and node_id = '${node_id}' and isnull(assignto,'')='' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        return '';
    }
}

let find_next_user_for_huiq = async (user) => {
    let data = await pjmain.query(`select B.dept_name + '-'+A.full_name AS user_name from PJMAIN..org_user A,PJMAIN..org_dept B  where  A.dept_code=B.dept_code and A.user_code = '${user}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0]['user_name'];
    } else {
        return '';
    }
}

//查询预登记-产品信息要素
let find_app_dfs_zxd_ydjcpxx_by_regitem_id = async (regitem_id) => {
    let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,
				 xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,dyjhbz, 
				 xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlw,zdgdqxzfw,zggdqxzfw, 
				 yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,
				 wtrjzjly,sytzrq,bgbs,xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,
				 jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry, 
				 gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,qtxmlx,ywlx,qtywlx,xmszd,sfszqq, 
				 xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf	FROM APP_DFS_ZXD_YDJCPXX WHERE regitem_id = '${regitem_id}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        //如果第一次没有填写，同步业务系统数据
        let project_info = await intrustqlc.query(`SELECT 
                                                    newId() uuid,
                                                    0 bsid,
                                                    A.REGITEM_ID regitem_id,
                                                    A.PRODUCT_ID productid,
                                                    A.PRODUCT_CODE productcode,
                                                    '31D' xtjgmc,
                                                    0 zcdz,
                                                    0 symjzc,
                                                    0 sjmjzc,
                                                    0 symxtzzc,
                                                    0 sjmfxzb,
                                                    '0' ydjlx,
                                                    CASE WHEN A.TYPE3 = '113801' THEN '0' WHEN A.TYPE3 = '113802' THEN '1' WHEN A.TYPE3 = '113803' THEN '2' ELSE '' END csxtcclx,
                                                    CASE WHEN A.TYPE3 = '113802' OR A.TYPE3 = '113803' THEN '0' ELSE '' END ccqxtcfzr,
                                                    CASE WHEN A.TYPE1 = 1 THEN '0' WHEN A.TYPE1 = 2 THEN '1' ELSE '' END dyjhbz,
                                                    CASE WHEN A.GNFL = '114301' THEN '0' WHEN A.GNFL = '114302' THEN '1' WHEN A.GNFL = '114303' THEN '2' ELSE '' END xtgn,
                                                    '0' bgywlx,
                                                    '0' sfwxffq,
                                                    '' qtbgywlx,
                                                    A.PRODUCT_NAME xtxmmc,
                                                    '1' nfxclzgmlx,
                                                    A.PRODUCT_MONEY / 10000 zdgdgmzfw,
                                                    0 zggdgmzfw,
                                                    CASE WHEN A.CPSTART_QXUNIT = 0 THEN '1' ELSE '0' END xtxmzqxlw,
                                                    CASE WHEN A.CPSTART_QXUNIT = 3 THEN CAST(A.CPSTART_PERIOD AS NVARCHAR(10)) WHEN A.CPSTART_QXUNIT = 4 THEN CAST(A.CPSTART_PERIOD/3 AS NVARCHAR(10)) WHEN A.CPSTART_QXUNIT = 5 THEN CAST(A.CPSTART_PERIOD/12 AS NVARCHAR(10)) ELSE '' END zdgdqxzfw,
                                                    '' zggdqxzfw,
                                                    '1' yjxtxmgm,
                                                    A.PRODUCT_MONEY / 10000 zdxtxmgmfw,
                                                    0 zgxtxmgmfw,
                                                    CASE WHEN A.CPSTART_QXUNIT = 0 THEN '1' ELSE '0' END xtxmqxlx,
                                                    CASE WHEN A.CPSTART_QXUNIT = 3 THEN CAST(A.CPSTART_PERIOD AS NVARCHAR(10)) WHEN A.CPSTART_QXUNIT = 4 THEN CAST(A.CPSTART_PERIOD/3 AS NVARCHAR(10)) WHEN A.CPSTART_QXUNIT = 5 THEN CAST(A.CPSTART_PERIOD/12 AS NVARCHAR(10)) ELSE '' END zdxtxmqxfw,
                                                    '' zgxtxmqxfw,
                                                    0 fqljfxgm,
                                                    null nfxhclsj,
                                                    '' fqcpqs,
                                                    '' wtrjzjly,
                                                    '' sytzrq,
                                                    '01' bgbs,
                                                    '' xtzjbgyh,
                                                    ROUND(ISNULL(A.XTBCL,0) * 100,2) xtbcl,
                                                    CASE WHEN A.HS_FLAG = 1 THEN '2' WHEN A.HS_FLAG = 2 THEN '0' ELSE '1' END syrsyllx,
                                                    isnull(A.MAX_RATE,0) syryqsylqj_zd,
                                                    isnull(A.MIN_RATE,0) syryqsylqj_zg,
                                                    CASE WHEN B.TYPE4 = '115703' THEN '0' WHEN B.TYPE4 = '115702' THEN '1' WHEN B.TYPE4 = '115701' THEN '2' WHEN B.TYPE4 = '115704' THEN '3' ELSE '' END xmly,
                                                    CASE WHEN B.GLFS = 1 THEN '0' WHEN B.GLFS = 2 THEN '1' ELSE '' END xmglfs,
                                                    '' xmtjjg,
                                                    '' jydsmc,
                                                    '' jydsxx,
                                                    B.TYPE5_NAME xtcctxhyyfs,
                                                    '' jyjg,
                                                    B.FXKZ_INFO fxkzcs,
                                                    CASE WHEN B.YJHKLY = 0 THEN '经营性现金流'
                                                        WHEN B.YJHKLY = 1 THEN '房地产销售收入'
                                                        WHEN B.YJHKLY = 2 THEN '信托资产转让或出售变现'
                                                        WHEN B.YJHKLY = 3 THEN '土地出让收入'
                                                        WHEN B.YJHKLY = 4 THEN '专项费用返还'
                                                        WHEN B.YJHKLY = 5 THEN '专项税收返还'
                                                        WHEN B.YJHKLY = 6 THEN 'BOT或类似收入'
                                                        WHEN B.YJHKLY = 7 THEN '财政兜底'
                                                        WHEN B.YJHKLY = 8 THEN '其他' ELSE '' END yjhklyjtcfs,
                                                    '' fxyasm,
                                                    '' gshfhgyj,
                                                    B.ADMIN_MANAGER_NAME xtjlxm,
                                                    '' xtjldh,
                                                    '' fggjglry,
                                                    '' gljylx,
                                                    '' qtgljylx,
                                                    '' glfqkyglgx,
                                                    '' gljymd,
                                                    '' gljydj,
                                                    '' sctlywdjqk,
                                                    '' xmlx,
                                                    '' qtxmlx,
                                                    '' ywlx,
                                                    '' qtywlx,
                                                    '' xmszd,
                                                    '' sfszqq,
                                                    '' xyzjbh,
                                                    '' zbjblqk,
                                                    '' kfshqkggdzzqk,
                                                    '' qtsm,
                                                    '' zjly,
                                                    '' sfjghxt,
                                                    '' yxlhbl,
                                                    '' tzfw,
                                                    '' tzgwqk,
                                                    '' tgsfglf
                                                FROM QLC_TPRODUCT A, QLC_TITEMREGINFO B
                                                    WHERE A.REGITEM_ID = B.REGITEM_ID AND B.REGITEM_ID = ${regitem_id}`, {
            type: intrustqlc.QueryTypes.SELECT
        });
        return project_info[0];
    }
}

//查询预登记-异地推介补充要素
let find_app_dfs_zxd_ydjtjd_by_uuid = async (uuid) => {
    let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,
								sfqgtj,tjd,tjd_p,tjd_c,tjd_a,tjjg,tjfl,tjq,jhtjgm,tjfshtjgl,tjfzrmc,tjfzrdh FROM APP_DFS_ZXD_YDJTJD WHERE relation_uuid = '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//保存预登记-产品信息要素
let insert_app_dfs_zxd_ydjcpxx = async (data) => {
    //先删除
    await dfs.query(`DELETE FROM APP_DFS_ZXD_YDJTJD FROM APP_DFS_ZXD_YDJTJD a, APP_DFS_ZXD_YDJCPXX b WHERE a.relation_uuid = b.relation_uuid and b.regitem_id = '${data.regitem_id}' and isnull(b.TASK_STATE,'0')='0'`);
    await dfs.query(`DELETE FROM APP_DFS_ZXD_YDJCPXX WHERE regitem_id = '${data.regitem_id}' and isnull(TASK_STATE,'0')='0'`);
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_YDJCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,
        dyjhbz,xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlw,zdgdqxzfw,zggdqxzfw,
        yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,wtrjzjly,sytzrq,bgbs,
        xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,
        yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry,gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,
        qtxmlx,ywlx,qtywlx,xmszd,sfszqq,xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf) values(
            '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.xtjgmc}','${data.zcdz}',${data.symjzc},${data.sjmjzc},${data.symxtzzc},${data.sjmfxzb},'${data.ydjlx}','${data.csxtcclx}','${data.ccqxtcfzr}','${data.dyjhbz}','${data.xtgn}','${data.bgywlx}','${data.sfwxffq}','${data.qtbgywlx}','${data.xtxmmc}','${data.nfxclzgmlx}',${data.zdgdgmzfw},${data.zggdgmzfw},'${data.xtxmzqxlw}','${data.zdgdqxzfw}','${data.zggdqxzfw}','${data.yjxtxmgm}',${data.zdxtxmgmfw},${data.zgxtxmgmfw},'${data.xtxmqxlx}','${data.zdxtxmqxfw}','${data.zgxtxmqxfw}',${data.fqljfxgm},'${data.nfxhclsj}','${data.fqcpqs}','${data.wtrjzjly}','${data.sytzrq}','${data.bgbs}','${data.xtzjbgyh}','${data.xtbcl}','${data.syrsyllx}',${data.syryqsylqj_zd},${data.syryqsylqj_zg},'${data.xmly}','${data.xmglfs}','${data.xmtjjg}','${data.jydsmc}','${data.jydsxx}','${data.xtcctxhyyfs}','${data.jyjg}','${data.fxkzcs}','${data.yjhklyjtcfs}','${data.fxyasm}','${data.gshfhgyj}','${data.xtjlxm}','${data.xtjldh}','${data.fggjglry}','${data.gljylx}','${data.qtgljylx}','${data.glfqkyglgx}','${data.gljymd}','${data.gljydj}','${data.sctlywdjqk}','${data.xmlx}','${data.qtxmlx}','${data.ywlx}','${data.qtywlx}','${data.xmszd}','${data.sfszqq}','${data.xyzjbh}','${data.zbjblqk}','${data.kfshqkggdzzqk}','${data.qtsm}','${data.zjly}','${data.sfjghxt}','${data.yxlhbl}','${data.tzfw}','${data.tzgwqk}','${data.tgsfglf}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

//保存预登记-异地推介补充要素
let insert_app_dfs_zxd_ydjtjd = async (data) => {
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_YDJTJD(relation_uuid,task_code,regitem_id,product_id,product_code,sfqgtj,tjd,tjd_p,tjd_c,tjd_a,tjjg,tjfl,tjq,jhtjgm,tjfshtjgl,tjfzrmc,tjfzrdh) values(
            '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.sfqgtj}','${data.tjd}','${data.tjd_p}','${data.tjd_c}','${data.tjd_a}','${data.tjjg}','${data.tjfl}','${data.tjq}',${data.jhtjgm},'${data.tjfshtjgl}','${data.tjfzrmc}','${data.tjfzrdh}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

//查询初始登记-产品信息要素
let find_app_dfs_zxd_cscpxx_by_regitem_id = async (regitem_id) => {
    let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,
					djlx, xtjgmc, cpqc, djcpbh, gscpbh, sfxtzcp, sdbs, fqzcpnbbh, xtccxz, dyjhbz, ccqxtcfzr, stzz, xtgn,
				 yxfs, kffbbs, xtsyfs, syfssm, jghbs, jghyxlhbl, zjcbs, totbs, glmxt, glzxt, csmjje, csmjfe, zjjsbz, yqmjzje, yqmjzfe,
				 yqmjzebz, zyyyly_ctq, zytxhy_ctq, ccglyyfs, ccglyyfs_ccq, xdzcjsyq, zczqhbs, tsyw, ywxism, syllx, zdyqsyl, zgyqsyl,
				 xtbclx, xtbcl, xtbc, htydbcsm, fxxmbs, fxtzbs, fxczjz, fxhscsnew, fxhscs, fxczcsbhbcsm, sfgdqxcp, xtcpsjclrq, cpjhdqr,
				 kfpd, shdxzxtj, ktqshbs, tjfs, tjmj, ydtjbs, xmtjf, sfgz, gzms, gzcj, gzjg, jzpgpd, jntgjg, jwtgdljg, jwtgdljggb, tzgwbs,
				 tzgwbh, grjgbs, gljybs, gljylx, gljybcsm, gllx, gljymd, gljydj, jzplpd, zcglbgpd, qsbgplbs, xtcpssbm, xtjlxm, fggjglry, lxdh
				FROM APP_DFS_ZXD_CSCPXX WHERE regitem_id = '${regitem_id}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        //如果第一次没有填写，同步业务系统数据
        let project_info = await intrustqlc.query(`SELECT 
        newId() uuid,
        0 bsid,
        A.REGITEM_ID regitem_id,
        A.PRODUCT_ID productid,
        A.PRODUCT_CODE productcode,
        '1' djlx,
        '31D' xtjgmc,
        A.PRODUCT_NAME cpqc,
        '' djcpbh,
        A.PRODUCT_CODE gscpbh,
        '0' sfxtzcp,
        '0' sdbs,
        '' fqzcpnbbh,
        CASE WHEN A.TYPE3 = '113801' THEN '0' WHEN A.TYPE3 = '113802' THEN '1' WHEN A.TYPE3 = '113803' THEN '2' ELSE '' END xtccxz,
        CASE WHEN A.TYPE1 = 1 THEN '0' WHEN A.TYPE1 = 2 THEN '1' ELSE '' END dyjhbz,
        CASE WHEN A.TYPE3 = '113802' OR A.TYPE3 = '113803' THEN '0' ELSE '' END ccqxtcfzr,
        CASE WHEN B.GLFS = 1 THEN '0' WHEN B.GLFS = 2 THEN '1' ELSE '' END stzz,
        CASE WHEN A.GNFL = '114301' THEN '0' WHEN A.GNFL = '114302' THEN '1' WHEN A.GNFL = '114303' THEN '2' ELSE '' END xtgn,
        CASE WHEN A.HS_FLAG = 1 THEN '2' WHEN A.HS_FLAG = 2 THEN '0' ELSE '1' END yxfs,
        CASE WHEN B.OPEN_FLAG = 1 THEN '1'WHEN B.OPEN_FLAG = 2 THEN '0' ELSE '' END kffbbs,
        CASE WHEN B.XTMD = 2 THEN '0' WHEN B.XTMD = 3 THEN '1' ELSE '0' END xtsyfs,
        '' syfssm,
        '2' jghbs,
        '' jghyxlhbl,
        '0' zjcbs,
        B.SFTOT totbs,
        B.MXTXMBM glmxt,
        '' glzxt,
        isnull(A.CL_MONEY,0) csmjje,
        isnull(A.CL_AMOUNT,0) csmjfe,
        'CNY' zjjsbz,
        0 yqmjzje,
        0 yqmjzfe,
        'CNY' yqmjzebz,
        '' zyyyly_ctq,
        '' zytxhy_ctq,
        '' ccglyyfs,
        CASE WHEN B.TYPE5 = '114101' THEN 'a' WHEN B.TYPE5 = '114102' THEN 'b' WHEN B.TYPE5 = '114104' THEN 'c' WHEN B.TYPE5 = '114105' THEN 'd' WHEN B.TYPE5 = '114103' THEN 'e' WHEN B.TYPE5 = '114107' THEN 'f' ELSE '' END ccglyyfs_ccq,
        '0' xdzcjsyq,
        '0' zczqhbs,
        'f' tsyw,
        '' ywxism,
        CASE WHEN A.HS_FLAG = 1 THEN '2' WHEN A.HS_FLAG = 2 THEN '0' ELSE '1' END syllx,
        isnull(A.MAX_RATE,0) zdyqsyl,
        CAST(ROUND(A.MIN_RATE*100,2) AS NVARCHAR(30)) zgyqsyl,
        CASE WHEN A.TYPE1 = 1 THEN '0' WHEN A.TYPE1 = 2 THEN '1' ELSE '' END xtbclx,
        ROUND(ISNULL(A.XTBCL,0) * 100,2) xtbcl,
        0 xtbc,
        '' htydbcsm,
        CASE WHEN A.RISK_RANK = 3 THEN '0' ELSE '1' END fxxmbs,
        '' fxtzbs,
        '' fxczjz,
        '' fxhscsnew,
        '' fxhscs,
        '' fxczcsbhbcsm,
        CASE WHEN A.CPSTART_QXUNIT = 0 THEN '1' ELSE '0' END sfgdqxcp,
        A.CPSTART_DATE xtcpsjclrq,
        A.CPEND_DATE cpjhdqr,
        CASE WHEN B.KFPD = 1 THEN '0' WHEN B.KFPD = 2 THEN '1' WHEN B.KFPD = 3 THEN '5' WHEN B.KFPD = 4 THEN '6' WHEN B.KFPD = 5 THEN '7' WHEN B.KFPD = 6 THEN '8' WHEN B.KFPD = 7 THEN '' WHEN B.KFPD = 8 THEN '3' WHEN B.KFPD = 0 THEN '9' ELSE '' END kfpd,
        '' shdxzxtj,
        '' ktqshbs,
        '' tjfs,
        '' tjmj,
        '0' ydtjbs,
        CASE WHEN B.TYPE4 = '115703' THEN '0' WHEN B.TYPE4 = '115702' THEN '1' WHEN B.TYPE4 = '115701' THEN '2' WHEN B.TYPE4 = '115704' THEN '3' ELSE '' END xmtjf,
        CASE WHEN B.SFZQTZ = 1 THEN '0' ELSE '1' END sfgz,
        '' gzms,
        '' gzcj,
        '' gzjg,
        '' jzpgpd,
        '' jntgjg,
        '' jwtgdljg,
        '' jwtgdljggb,
        '' tzgwbs,
        '' tzgwbh,
        '' grjgbs,
        CASE WHEN ISNULL(B.GLJY,'') <> '' THEN '1' ELSE '0' END gljybs,
        '' gljylx,
        '' gljybcsm,
        '' gllx,
        '' gljymd,
        '' gljydj,
        '' jzplpd,
        '7' zcglbgpd,
        '1' qsbgplbs,
        B.DEPT_NAME xtcpssbm,
        B.ADMIN_MANAGER_NAME xtjlxm,
        '' fggjglry,
        '' lxdh
        FROM QLC_TPRODUCT A, QLC_TITEMREGINFO B
         WHERE A.REGITEM_ID = B.REGITEM_ID AND B.REGITEM_ID = ${regitem_id}`, {
            type: intrustqlc.QueryTypes.SELECT
        });
        return project_info[0];
    }
}

//保存初始登记-产品信息要素
let insert_app_dfs_zxd_cscpxx = async (data) => {
    //先删除
    await dfs.query(`DELETE FROM APP_DFS_ZXD_CSCPXX WHERE regitem_id = '${data.regitem_id}' and isnull(TASK_STATE,'0')='0'`);
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_CSCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,djlx,xtjgmc,cpqc,djcpbh,gscpbh,sfxtzcp,sdbs,fqzcpnbbh,xtccxz,
        dyjhbz,ccqxtcfzr,stzz,xtgn,yxfs,kffbbs,xtsyfs,syfssm,jghbs,jghyxlhbl,zjcbs,totbs,glmxt,glzxt,
        csmjje,csmjfe,zjjsbz,yqmjzje,yqmjzfe,yqmjzebz,zyyyly_ctq,zytxhy_ctq,ccglyyfs,ccglyyfs_ccq,xdzcjsyq,
        zczqhbs,tsyw,ywxism,syllx,zdyqsyl,zgyqsyl,xtbclx,xtbcl,xtbc,htydbcsm,fxxmbs,fxtzbs,fxczjz,fxhscsnew,
        fxhscs,fxczcsbhbcsm,sfgdqxcp,xtcpsjclrq,cpjhdqr,kfpd,shdxzxtj,ktqshbs,tjfs,tjmj,ydtjbs,xmtjf,sfgz,
        gzms,gzcj,gzjg,jzpgpd,jntgjg,jwtgdljg,jwtgdljggb,tzgwbs,tzgwbh,grjgbs,gljybs,gljylx,gljybcsm,gllx,
        gljymd,gljydj,jzplpd,zcglbgpd,qsbgplbs,xtcpssbm,xtjlxm,fggjglry,lxdh) values(
            '${data.uuid}',${data.bsid},${data.regitem_id},${data.productid},'${data.productcode}','${data.djlx}','${data.xtjgmc}','${data.cpqc}','${data.djcpbh}','${data.gscpbh}','${data.sfxtzcp}','${data.sdbs}','${data.fqzcpnbbh}','${data.xtccxz}','${data.dyjhbz}','${data.ccqxtcfzr}','${data.stzz}','${data.xtgn}','${data.yxfs}','${data.kffbbs}','${data.xtsyfs}','${data.syfssm}','${data.jghbs}','${data.jghyxlhbl}','${data.zjcbs}','${data.totbs}','${data.glmxt}','${data.glzxt}',${data.csmjje},${data.csmjfe},'${data.zjjsbz}',${data.yqmjzje},${data.yqmjzfe},'${data.yqmjzebz}','${data.zyyyly_ctq}','${data.zytxhy_ctq}','${data.ccglyyfs}','${data.ccglyyfs_ccq}','${data.xdzcjsyq}','${data.zczqhbs}','${data.tsyw}','${data.ywxism}','${data.syllx}',${data.zdyqsyl},'${data.zgyqsyl}','${data.xtbclx}',${data.xtbcl},${data.xtbc},'${data.htydbcsm}','${data.fxxmbs}','${data.fxtzbs}','${data.fxczjz}','${data.fxhscsnew}','${data.fxhscs}','${data.fxczcsbhbcsm}','${data.sfgdqxcp}','${data.xtcpsjclrq}','${data.cpjhdqr}','${data.kfpd}','${data.shdxzxtj}','${data.ktqshbs}','${data.tjfs}','${data.tjmj}','${data.ydtjbs}','${data.xmtjf}','${data.sfgz}','${data.gzms}','${data.gzcj}','${data.gzjg}','${data.jzpgpd}','${data.jntgjg}','${data.jwtgdljg}','${data.jwtgdljggb}','${data.tzgwbs}','${data.tzgwbh}','${data.grjgbs}','${data.gljybs}','${data.gljylx}','${data.gljybcsm}','${data.gllx}','${data.gljymd}','${data.gljydj}','${data.jzplpd}','${data.zcglbgpd}','${data.qsbgplbs}','${data.xtcpssbm}','${data.xtjlxm}','${data.fggjglry}','${data.lxdh}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

//查询终止登记-产品信息要素
let find_app_dfs_zxd_zzcpxx_by_regitem_id = async (regitem_id) => {
    let data = await dfs.query(`SELECT RELATION_UUID as uuid, TASK_CODE as bsid, REGITEM_ID as regitem_id,PRODUCT_ID as productid, PRODUCT_CODE as productcode,
				 xtjgmc, djcpbh, cpqc, qsrq, sfaydrqqs, ssxtje, xtbjljgfe, xtsyljfpe, tgljgdbc, tgljyjbc, strljgdbc,
				 strljyjbc, sjxtbcl, xtfyze, xtfyl, xtbgfl, sjsy, sjsyl, sshje, shsje, pfje, ywxxsm FROM APP_DFS_ZXD_ZZCPXX WHERE regitem_id = '${regitem_id}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        //如果第一次没有填写，同步业务系统数据
        let project_info = await intrustqlc.query(`SELECT 
        newId() uuid,
        0 bsid,
        A.REGITEM_ID regitem_id,
        A.PRODUCT_ID productid,
        A.PRODUCT_CODE productcode,
        '31D' xtjgmc,
        '' djcpbh,
        A.PRODUCT_NAME cpqc,
        '' qsrq,
        '' sfaydrqqs,
        0 ssxtje,
        0 xtbjljgfe,
        0 xtsyljfpe,
        0 tgljgdbc,
        0 tgljyjbc,
        0 strljgdbc,
        0 strljyjbc,
        0 sjxtbcl,
        0 xtfyze,
        0 xtfyl,
        0 xtbgfl,
        0 sjsy,
        0 sjsyl,
        0 sshje,
        0 shsje,
        0 pfje,
        '' ywxxsm
        FROM QLC_TPRODUCT A, QLC_TITEMREGINFO B
         WHERE A.REGITEM_ID = B.REGITEM_ID AND B.REGITEM_ID = ${regitem_id}`, {
            type: intrustqlc.QueryTypes.SELECT
        });
        return project_info[0];
    }
}

//保存终止登记-产品信息要素
let insert_app_dfs_zxd_zzcpxx = async (data) => {
    //先删除
    await dfs.query(`DELETE FROM APP_DFS_ZXD_ZZCPXX WHERE regitem_id = '${data.regitem_id}' and isnull(TASK_STATE,'0')='0'`);
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_ZZCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,xtjgmc,djcpbh,cpqc,qsrq,sfaydrqqs,ssxtje,xtbjljgfe,xtsyljfpe,tgljgdbc,
        tgljyjbc,strljgdbc,strljyjbc,sjxtbcl,xtfyze,xtfyl,xtbgfl,sjsy,sjsyl,sshje,shsje,pfje,ywxxsm) values(
            '${data.uuid}',${data.bsid},${data.regitem_id},${data.productid},'${data.productcode}','${data.xtjgmc}','${data.djcpbh}','${data.cpqc}','${data.qsrq}','${data.sfaydrqqs}',${data.ssxtje},${data.xtbjljgfe},${data.xtsyljfpe},${data.tgljgdbc},${data.tgljyjbc},${data.strljgdbc},${data.strljyjbc},${data.sjxtbcl},${data.xtfyze},${data.xtfyl},${data.xtbgfl},${data.sjsy},${data.sjsyl},${data.sshje},${data.shsje},${data.pfje},'${data.ywxxsm}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

//查询事前报告-产品信息要素
let find_app_dfs_zxd_sqcpxx_regitem_id = async (regitem_id) => {
    let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, 
					xtjgmc, xtxmmc, djcpbh, csxtcclx, dyjhbz, sfgljy, sqbgyy, xtjlxm, xtjldh, fggjglry
					FROM APP_DFS_ZXD_SQCPXX WHERE regitem_id = '${regitem_id}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data[0];
    } else {
        //如果第一次没有填写，同步业务系统数据
        let project_info = await intrustqlc.query(`SELECT 
        newId() uuid,
        0 bsid,
        A.REGITEM_ID regitem_id,
        A.PRODUCT_ID productid,
        A.PRODUCT_CODE productcode,
        '31D' xtjgmc,
        A.PRODUCT_NAME xtxmmc,
        '' djcpbh,
        CASE WHEN A.TYPE3 = '113801' THEN '0' WHEN A.TYPE3 = '113802' THEN '1' WHEN A.TYPE3 = '113803' THEN '2' ELSE '' END csxtcclx,
        CASE WHEN A.TYPE1 = 1 THEN '0' WHEN A.TYPE1 = 2 THEN '1' ELSE '' END dyjhbz,
        '' sfgljy,
        '' sqbgyy,
        B.ADMIN_MANAGER_NAME xtjlxm,
        '' xtjldh,
        '' fggjglry
        FROM QLC_TPRODUCT A, QLC_TITEMREGINFO B
         WHERE A.REGITEM_ID = B.REGITEM_ID AND B.REGITEM_ID = ${regitem_id}`, {
            type: intrustqlc.QueryTypes.SELECT
        });
        return project_info[0];
    }
}

//保存事前报告-产品信息要素
let insert_app_dfs_zxd_sqcpxx = async (data) => {
    //先删除
    await dfs.query(`DELETE FROM APP_DFS_ZXD_SQCPXX WHERE regitem_id = '${data.regitem_id}' and isnull(TASK_STATE,'0')='0'`);
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_SQCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,xtjgmc,xtxmmc,djcpbh,csxtcclx,dyjhbz,sfgljy,sqbgyy,xtjlxm,xtjldh,fggjglry) values(
            '${data.uuid}',${data.bsid},${data.regitem_id},${data.productid},'${data.productcode}','${data.xtjgmc}','${data.xtxmmc}','${data.djcpbh}','${data.csxtcclx}','${data.dyjhbz}','${data.sfgljy}','${data.sqbgyy}','${data.xtjlxm}','${data.xtjldh}','${data.fggjglry}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
}

//查询预登记-产品信息要素-详情
let query_app_dfs_zxd_ydjcpxx = async (regitem_id) => {
    //根据节点ID获取事务ID
    let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '${regitem_id}'  `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (task_info.length > 0) {
        let affa_id = task_info[0].affa_id;
        let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_ydjcpxx '`+affa_id+`'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        return project_info[0];
    } else {
        return '';
    }
}

//查询预登记-异地推介补充要素-详情
let query_app_dfs_zxd_ydjtjd = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_ydjtjd '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询终止登记-产品信息-详情
let query_app_dfs_zxd_zzcpxx = async (regitem_id) => {
    let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_zzcpxx 0,'',0,'${regitem_id}',0  `, {
        type: pjmain.QueryTypes.SELECT
    });
    return project_info[0];
}

//查询事前登记-产品信息-详情
let query_app_dfs_zxd_sqcpxx = async (regitem_id) => {
    let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_sqcpxx 0,'',0,'${regitem_id}',0  `, {
        type: pjmain.QueryTypes.SELECT
    });
    return project_info[0];
}

//查询初始登记-产品信息要素-详情
let query_app_dfs_zxd_cscpxx = async (regitem_id) => {
    let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_cscpxx 0,'',0,'${regitem_id}',0  `, {
        type: pjmain.QueryTypes.SELECT
    });
    return project_info[0];
}

//查询初始登记-初始交易对手-详情
let query_app_dfs_zxd_csjyds = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_csjyds '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询初始登记-初始受益权结构-详情
let query_app_dfs_zxd_cssyq = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_cssyq '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询初始登记-初始信托合同-详情
let query_app_dfs_zxd_csxtht = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_csxtht '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询初始登记-初始银行资金账户-详情
let query_app_dfs_zxd_yhzjzh = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_yhzjzh '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询初始登记-初始证券类账户-详情
let query_app_dfs_zxd_cszqzh = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_cszqzh '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return "1";
    }
}

//查询数据字典
let query_app_dfs_scode_content = async (data) => {
    let list = await dfs.query(`select * from RZDFS..APP_DFS_SCODE_CONTENT where REGION_CODE = '${data.region_code}' and (isnull('${data.region_code}','') = '' or ITEM_CODE like '${data.item_code}%') order by REGION_CODE,ORDER_NO `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (list.length > 0) {
        return list;
    } else {
        return "1";
    }
}

module.exports = {
    find_affar: find_affar,
    find_affar_by_taskid: find_affar_by_taskid,
    find_tasks: find_tasks,
    find_project_info: find_project_info,
    find_project_info_by_product_id: find_project_info_by_product_id,
    find_project_info_by_problem_id: find_project_info_by_problem_id,
    find_product_info: find_product_info,
    find_account_info: find_account_info,
    find_bank_name: find_bank_name,
    find_pay_apply: find_pay_apply,
    find_regitem_id_by_affaid: find_regitem_id_by_affaid,
    find_regitem_id_by_taskid: find_regitem_id_by_taskid,
    find_asst_name: find_asst_name,
    find_cb: find_cb,
    find_bank_name_ta: find_bank_name_ta,
    find_cust_name: find_cust_name,
    find_apprpvalsela: find_apprpvalsela,
    find_supply_info: find_supply_info,
    find_affanumber_by_taskid: find_affanumber_by_taskid,
    find_affanumber_by_affaid: find_affanumber_by_affaid,
    find_assetname_by_assetid: find_assetname_by_assetid,
    find_taskinfo: find_taskinfo,
    find_taskinfonumber: find_taskinfonumber,
    find_twarrants_transfer_info: find_twarrants_transfer_info,
    find_twarrants_transfer_list_info: find_twarrants_transfer_list_info,
    find_file_archive_list_info: find_file_archive_list_info,
    find_file_archive_info: find_file_archive_info,
    find_sign_name_by_affaid: find_sign_name_by_affaid,
    find_customer_contration_info: find_customer_contration_info,
    find_task_summer_for_huiq: find_task_summer_for_huiq,
    find_next_user_for_huiq: find_next_user_for_huiq,
    find_app_dfs_zxd_ydjcpxx_by_regitem_id: find_app_dfs_zxd_ydjcpxx_by_regitem_id,
    find_app_dfs_zxd_ydjtjd_by_uuid: find_app_dfs_zxd_ydjtjd_by_uuid,
    insert_app_dfs_zxd_ydjcpxx: insert_app_dfs_zxd_ydjcpxx,
    insert_app_dfs_zxd_ydjtjd: insert_app_dfs_zxd_ydjtjd,
    find_app_dfs_zxd_cscpxx_by_regitem_id: find_app_dfs_zxd_cscpxx_by_regitem_id,
    insert_app_dfs_zxd_cscpxx: insert_app_dfs_zxd_cscpxx,
    find_app_dfs_zxd_zzcpxx_by_regitem_id: find_app_dfs_zxd_zzcpxx_by_regitem_id,
    insert_app_dfs_zxd_zzcpxx: insert_app_dfs_zxd_zzcpxx,
    find_app_dfs_zxd_sqcpxx_regitem_id: find_app_dfs_zxd_sqcpxx_regitem_id,
    insert_app_dfs_zxd_sqcpxx: insert_app_dfs_zxd_sqcpxx,
    query_app_dfs_zxd_ydjcpxx: query_app_dfs_zxd_ydjcpxx,
    query_app_dfs_zxd_ydjtjd: query_app_dfs_zxd_ydjtjd,
    query_app_dfs_zxd_zzcpxx: query_app_dfs_zxd_zzcpxx,
    query_app_dfs_zxd_sqcpxx: query_app_dfs_zxd_sqcpxx,
    query_app_dfs_zxd_cscpxx: query_app_dfs_zxd_cscpxx,
    query_app_dfs_zxd_csjyds: query_app_dfs_zxd_csjyds,
    query_app_dfs_zxd_cssyq: query_app_dfs_zxd_cssyq,
    query_app_dfs_zxd_csxtht: query_app_dfs_zxd_csxtht,
    query_app_dfs_zxd_yhzjzh: query_app_dfs_zxd_yhzjzh,
    query_app_dfs_zxd_cszqzh: query_app_dfs_zxd_cszqzh,
    query_app_dfs_scode_content: query_app_dfs_scode_content
}