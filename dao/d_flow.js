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
    //根据节点ID获取事务ID
    let arr = regitem_id.split("@@");
    regitem_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + regitem_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            regitem_id = task_info[0].affa_id;
        }
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
					 xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,dyjhbz, 
					 xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlx,zdgdqxzfw,zggdqxzfw, 
					 yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,
					 wtrjzjly,sytzrq,bgbs,xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,
					 jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry, 
					 gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,qtxmlx,ywlx,qtywlx,xmszd,sfszqq,case when dyjhbz='1' then dbo.GETDATEADD('',5,'WORKDAY') else dbo.GETDATEADD('',2,'WORKDAY') end as workdate, 
					 xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf,handle_date handledate,zxd_code zxdcode,over_state overstate,over_date overdate,remark,input_time,input_user,input_dept,update_time 
					 FROM APP_DFS_ZXD_YDJCPXX WHERE problem_id = '${regitem_id}'`, {
			type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		}
    }else if (arr[0] == "1") {
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
					 xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,dyjhbz, 
					 xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlx,zdgdqxzfw,zggdqxzfw, 
					 yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,
					 wtrjzjly,sytzrq,bgbs,xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,
					 jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry, 
					 gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,qtxmlx,ywlx,qtywlx,xmszd,sfszqq,case when dyjhbz='1' then dbo.GETDATEADD('',5,'WORKDAY') else dbo.GETDATEADD('',2,'WORKDAY') end as workdate, 
					 xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf,handle_date handledate,zxd_code zxdcode,over_state overstate,over_date overdate,remark,input_time,input_user,input_dept,update_time 
					 FROM APP_DFS_ZXD_YDJCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
			type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		} else {
			//先采集
			await dfs.query(`exec SP_CHANGE_PRE_REGISTRATION_01 ${regitem_id} `);
			//再返回
			let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
							xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,dyjhbz, 
							xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlx,zdgdqxzfw,zggdqxzfw, 
							yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,
							wtrjzjly,sytzrq,bgbs,xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,
							jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry, 
							gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,qtxmlx,ywlx,qtywlx,xmszd,sfszqq,case when dyjhbz='1' then dbo.GETDATEADD('',5,'WORKDAY') else dbo.GETDATEADD('',2,'WORKDAY') end as workdate,  
							xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf,handle_date handledate,zxd_code zxdcode,over_state overstate,over_date overdate,remark,input_time,input_user,input_dept,update_time 
							FROM APP_DFS_ZXD_YDJCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
				type: pjmain.QueryTypes.SELECT
			});
			if (data.length > 0) {
				return data[0];
			} else {
				return new Object();
			}
		}
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
    //字段非必输项空值处理
    if (typeof (data.sfwxffq) == "undefined") data.sfwxffq = '';
    if (typeof (data.sfszqq) == "undefined") data.sfszqq = '';
    if (typeof (data.sfjghxt) == "undefined") data.sfjghxt = '';
    if (typeof (data.tgsfglf) == "undefined") data.tgsfglf = '';
    if (typeof (data.ccqxtcfzr) == "undefined") data.ccqxtcfzr = '';
    if (data.zdgdgmzfw == '') data.zdgdgmzfw = null;
    if (data.zggdgmzfw == '') data.zggdgmzfw = null;
    if (data.zdxtxmgmfw == '') data.zdxtxmgmfw = null;
    if (data.zgxtxmgmfw == '') data.zgxtxmgmfw = null;
    if (data.fqljfxgm == '') data.fqljfxgm = null;
    if (data.syryqsylqj_zd == '') data.syryqsylqj_zd = null;
    if (data.syryqsylqj_zg == '') data.syryqsylqj_zg = null;
    let record = await dfs.query(`SELECT id FROM APP_DFS_ZXD_YDJCPXX WHERE relation_uuid = '${data.uuid}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    if (record.length > 0) {
        //后续更新操作
        await dfs.query(`update APP_DFS_ZXD_YDJCPXX set xtjgmc='${data.xtjgmc}',zcdz='${data.zcdz}',symjzc=${data.symjzc},sjmjzc=${data.sjmjzc},symxtzzc=${data.symxtzzc},sjmfxzb=${data.sjmfxzb},ydjlx='${data.ydjlx}',
				csxtcclx='${data.csxtcclx}',ccqxtcfzr='${data.ccqxtcfzr}',dyjhbz='${data.dyjhbz}',xtgn='${data.xtgn}',bgywlx='${data.bgywlx}',sfwxffq='${data.sfwxffq}',
				qtbgywlx='${data.qtbgywlx}',xtxmmc='${data.xtxmmc}',nfxclzgmlx='${data.nfxclzgmlx}',zdgdgmzfw=${data.zdgdgmzfw},zggdgmzfw=${data.zggdgmzfw},xtxmzqxlx='${data.xtxmzqxlx}',
				zdgdqxzfw='${data.zdgdqxzfw}',zggdqxzfw='${data.zggdqxzfw}',yjxtxmgm='${data.yjxtxmgm}',zdxtxmgmfw=${data.zdxtxmgmfw},zgxtxmgmfw=${data.zgxtxmgmfw},xtxmqxlx='${data.xtxmqxlx}',
				zdxtxmqxfw='${data.zdxtxmqxfw}',zgxtxmqxfw='${data.zgxtxmqxfw}',fqljfxgm=${data.fqljfxgm},nfxhclsj='${data.nfxhclsj}',fqcpqs='${data.fqcpqs}',wtrjzjly='${data.wtrjzjly}',
				sytzrq='${data.sytzrq}',bgbs='${data.bgbs}',xtzjbgyh='${data.xtzjbgyh}',xtbcl='${data.xtbcl}',syrsyllx='${data.syrsyllx}',syryqsylqj_zd=${data.syryqsylqj_zd},
				syryqsylqj_zg=${data.syryqsylqj_zg},xmly='${data.xmly}',xmglfs='${data.xmglfs}',xmtjjg='${data.xmtjjg}',jydsmc='${data.jydsmc}',jydsxx='${data.jydsxx}',
				xtcctxhyyfs='${data.xtcctxhyyfs}',jyjg='${data.jyjg}',fxkzcs='${data.fxkzcs}',yjhklyjtcfs='${data.yjhklyjtcfs}',fxyasm='${data.fxyasm}',gshfhgyj='${data.gshfhgyj}',
				xtjlxm='${data.xtjlxm}',xtjldh='${data.xtjldh}',fggjglry='${data.fggjglry}',gljylx='${data.gljylx}',qtgljylx='${data.qtgljylx}',glfqkyglgx='${data.glfqkyglgx}',
				gljymd='${data.gljymd}',gljydj='${data.gljydj}',sctlywdjqk='${data.sctlywdjqk}',xmlx='${data.xmlx}',qtxmlx='${data.qtxmlx}',ywlx='${data.ywlx}',qtywlx='${data.qtywlx}',
				xmszd='${data.xmszd}',sfszqq='${data.sfszqq}',xyzjbh='${data.xyzjbh}',zbjblqk='${data.zbjblqk}',kfshqkggdzzqk='${data.kfshqkggdzzqk}',qtsm='${data.qtsm}',zjly='${data.zjly}',
                sfjghxt='${data.sfjghxt}',yxlhbl='${data.yxlhbl}',tzfw='${data.tzfw}',tzgwqk='${data.tzgwqk}',tgsfglf='${data.tgsfglf}',handle_date='${data.handledate}',zxd_code='${data.zxdcode}',over_state='${data.overstate}',over_date='${data.overdate}',
                remark='save',task_code=NULL,update_time=CONVERT(varchar(20),getdate(),120)
				where ID = '${record[0].id}'`)
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        //首次插入操作
        await dfs.query(`INSERT INTO APP_DFS_ZXD_YDJCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,problem_id,xtjgmc,zcdz,symjzc,sjmjzc,symxtzzc,sjmfxzb,ydjlx,csxtcclx,ccqxtcfzr,
			dyjhbz,xtgn,bgywlx,sfwxffq,qtbgywlx,xtxmmc,nfxclzgmlx,zdgdgmzfw,zggdgmzfw,xtxmzqxlx,zdgdqxzfw,zggdqxzfw,
			yjxtxmgm,zdxtxmgmfw,zgxtxmgmfw,xtxmqxlx,zdxtxmqxfw,zgxtxmqxfw,fqljfxgm,nfxhclsj,fqcpqs,wtrjzjly,sytzrq,bgbs,
			xtzjbgyh,xtbcl,syrsyllx,syryqsylqj_zd,syryqsylqj_zg,xmly,xmglfs,xmtjjg,jydsmc,jydsxx,xtcctxhyyfs,jyjg,fxkzcs,
			yjhklyjtcfs,fxyasm,gshfhgyj,xtjlxm,xtjldh,fggjglry,gljylx,qtgljylx,glfqkyglgx,gljymd,gljydj,sctlywdjqk,xmlx,
			qtxmlx,ywlx,qtywlx,xmszd,sfszqq,xyzjbh,zbjblqk,kfshqkggdzzqk,qtsm,zjly,sfjghxt,yxlhbl,tzfw,tzgwqk,tgsfglf,remark,input_time,input_user,input_dept,update_time) values(
				'${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.problem_id}','${data.xtjgmc}','${data.zcdz}',${data.symjzc},${data.sjmjzc},${data.symxtzzc},${data.sjmfxzb},'${data.ydjlx}','${data.csxtcclx}','${data.ccqxtcfzr}','${data.dyjhbz}','${data.xtgn}','${data.bgywlx}','${data.sfwxffq}','${data.qtbgywlx}','${data.xtxmmc}','${data.nfxclzgmlx}',${data.zdgdgmzfw},${data.zggdgmzfw},'${data.xtxmzqxlx}','${data.zdgdqxzfw}','${data.zggdqxzfw}','${data.yjxtxmgm}',${data.zdxtxmgmfw},${data.zgxtxmgmfw},'${data.xtxmqxlx}','${data.zdxtxmqxfw}','${data.zgxtxmqxfw}',${data.fqljfxgm},'${data.nfxhclsj}','${data.fqcpqs}','${data.wtrjzjly}','${data.sytzrq}','${data.bgbs}','${data.xtzjbgyh}','${data.xtbcl}','${data.syrsyllx}',${data.syryqsylqj_zd},${data.syryqsylqj_zg},'${data.xmly}','${data.xmglfs}','${data.xmtjjg}','${data.jydsmc}','${data.jydsxx}','${data.xtcctxhyyfs}','${data.jyjg}','${data.fxkzcs}','${data.yjhklyjtcfs}','${data.fxyasm}','${data.gshfhgyj}','${data.xtjlxm}','${data.xtjldh}','${data.fggjglry}','${data.gljylx}','${data.qtgljylx}','${data.glfqkyglgx}','${data.gljymd}','${data.gljydj}','${data.sctlywdjqk}','${data.xmlx}','${data.qtxmlx}','${data.ywlx}','${data.qtywlx}','${data.xmszd}','${data.sfszqq}','${data.xyzjbh}','${data.zbjblqk}','${data.kfshqkggdzzqk}','${data.qtsm}','${data.zjly}','${data.sfjghxt}','${data.yxlhbl}','${data.tzfw}','${data.tzgwqk}','${data.tgsfglf}','${data.remark}','${data.input_time}','${data.input_user}','${data.input_dept}','${data.update_time}'
			)`)
            .then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

//保存预登记-异地推介补充要素
let insert_app_dfs_zxd_ydjtjd = async (data) => {
	if(typeof(data.sfqgtj)=="undefined") data.sfqgtj = '';
	if(data.jhtjgm=='') data.jhtjgm=null;
    await dfs.query(`DELETE FROM APP_DFS_ZXD_YDJTJD WHERE relation_uuid = '${data.uuid}'`);
	//首次插入操作
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
    //根据节点ID获取事务ID
    let arr = regitem_id.split("@@");
    regitem_id = arr[1];
    if (arr[0] == "2") {//流程中节点编辑操作
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + regitem_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            regitem_id = task_info[0].affa_id;
        }
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
						djlx, xtjgmc, cpqc, djcpbh, gscpbh, sfxtzcp, sdbs, fqzcpnbbh, xtccxz, dyjhbz, ccqxtcfzr, stzz, xtgn,
					 yxfs, kffbbs, xtsyfs, syfssm, jghbs, jghyxlhbl, zjcbs, totbs, glmxt, glzxt, csmjje, csmjfe, zjjsbz, yqmjzje, yqmjzfe,
					 yqmjzebz, zyyyly_ctq, zytxhy_ctq, ccglyyfs, ccglyyfs_ccq, xdzcjsyq, zczqhbs, tsyw, ywxism, syllx, zdyqsyl, zgyqsyl,
					 xtbclx, xtbcl, xtbc, htydbcsm, fxxmbs, fxtzbs, fxczjz, fxhscsnew, fxhscs, fxczcsbhbcsm, sfgdqxcp, xtcpsjclrq, cpjhdqr,
					 kfpd, shdxzxtj, ktqshbs, tjfs, tjmj, ydtjbs, xmtjf, sfgz, gzms, gzcj, gzjg, jzpgpd, jntgjg, jwtgdljg, jwtgdljggb, tzgwbs,
					 tzgwbh, grjgbs, gljybs, gljylx, gljybcsm, gllx, gljymd, gljydj, jzplpd, zcglbgpd, qsbgplbs, xtcpssbm, xtjlxm, fggjglry, lxdh,handle_date handledate,over_date overdate,
					 remark,input_time,input_user,input_dept,update_time
					FROM APP_DFS_ZXD_CSCPXX WHERE problem_id = '${regitem_id}'`, {
			type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		}
    }else if (arr[0] == "1") {//发起节点编辑操作
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
						djlx, xtjgmc, cpqc, djcpbh, gscpbh, sfxtzcp, sdbs, fqzcpnbbh, xtccxz, dyjhbz, ccqxtcfzr, stzz, xtgn,
					 yxfs, kffbbs, xtsyfs, syfssm, jghbs, jghyxlhbl, zjcbs, totbs, glmxt, glzxt, csmjje, csmjfe, zjjsbz, yqmjzje, yqmjzfe,
					 yqmjzebz, zyyyly_ctq, zytxhy_ctq, ccglyyfs, ccglyyfs_ccq, xdzcjsyq, zczqhbs, tsyw, ywxism, syllx, zdyqsyl, zgyqsyl,
					 xtbclx, xtbcl, xtbc, htydbcsm, fxxmbs, fxtzbs, fxczjz, fxhscsnew, fxhscs, fxczcsbhbcsm, sfgdqxcp, xtcpsjclrq, cpjhdqr,
					 kfpd, shdxzxtj, ktqshbs, tjfs, tjmj, ydtjbs, xmtjf, sfgz, gzms, gzcj, gzjg, jzpgpd, jntgjg, jwtgdljg, jwtgdljggb, tzgwbs,
					 tzgwbh, grjgbs, gljybs, gljylx, gljybcsm, gllx, gljymd, gljydj, jzplpd, zcglbgpd, qsbgplbs, xtcpssbm, xtjlxm, fggjglry, lxdh,handle_date handledate,over_date overdate,
					 remark,input_time,input_user,input_dept,update_time
					FROM APP_DFS_ZXD_CSCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
			type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		} else {
			//先采集
			await dfs.query(`exec SP_CHANGE_CS_BG_GZ_02 ${regitem_id} `);
			//再返回
			let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
						djlx, xtjgmc, cpqc, djcpbh, gscpbh, sfxtzcp, sdbs, fqzcpnbbh, xtccxz, dyjhbz, ccqxtcfzr, stzz, xtgn,
					 yxfs, kffbbs, xtsyfs, syfssm, jghbs, jghyxlhbl, zjcbs, totbs, glmxt, glzxt, csmjje, csmjfe, zjjsbz, yqmjzje, yqmjzfe,
					 yqmjzebz, zyyyly_ctq, zytxhy_ctq, ccglyyfs, ccglyyfs_ccq, xdzcjsyq, zczqhbs, tsyw, ywxism, syllx, zdyqsyl, zgyqsyl,
					 xtbclx, xtbcl, xtbc, htydbcsm, fxxmbs, fxtzbs, fxczjz, fxhscsnew, fxhscs, fxczcsbhbcsm, sfgdqxcp, xtcpsjclrq, cpjhdqr,
					 kfpd, shdxzxtj, ktqshbs, tjfs, tjmj, ydtjbs, xmtjf, sfgz, gzms, gzcj, gzjg, jzpgpd, jntgjg, jwtgdljg, jwtgdljggb, tzgwbs,
					 tzgwbh, grjgbs, gljybs, gljylx, gljybcsm, gllx, gljymd, gljydj, jzplpd, zcglbgpd, qsbgplbs, xtcpssbm, xtjlxm, fggjglry, lxdh,handle_date handledate,over_date overdate,
					 remark,input_time,input_user,input_dept,update_time
					FROM APP_DFS_ZXD_CSCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
				type: pjmain.QueryTypes.SELECT
			});
			if (data.length > 0) {
				return data[0];
			} else {
				return new Object();
			}
		}
	}
}

//查询预登记-交易对手要素
let find_app_dfs_zxd_csjyds_by_uuid = async (uuid) => {
    let data = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, jydsjgzzjgdm, jydsjglx, jydsjgzclb FROM APP_DFS_ZXD_CSJYDS WHERE relation_uuid = '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return new Object();
    }
}

//查询预登记-受益权结构要素集合（分页）
let find_app_dfs_zxd_cssyq_by_uuid = async (uuid, offset, pageNumber) => {
    //查询总的记录数
    let number = await dfs.query(`select count(1) NUMBER FROM APP_DFS_ZXD_CSSYQ WHERE relation_uuid = '${uuid}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    let total = number[0]['NUMBER'];

    let rows = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, syqxh, syqdm, dbo.getMCodeName('Init033',syqlx) syqlx, fpsx, dbo.getMCodeName('Init017',syqsyllx) syqsyllx, syqyqsyl, yqsylsm, dbo.getMCodeName('Init034',fhfs) fhfs, dbo.getMCodeName('Init035',fpfs) fpfs, dbo.getMCodeName('Init036',fppl) fppl FROM APP_DFS_ZXD_CSSYQ WHERE relation_uuid = '${uuid}' ORDER BY SYQXH offset ${offset} row fetch next ${pageNumber} rows only `, {
        type: pjmain.QueryTypes.SELECT
    });
    
    return {
        total,
        rows
    };
}

//查询预登记-受益权结构要素集合
let find_app_dfs_zxd_cssyq_by_id = async (id) => {
    let data = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, syqxh, syqdm, syqlx, fpsx, syqsyllx, syqyqsyl, yqsylsm, fhfs, fpfs, fppl FROM APP_DFS_ZXD_CSSYQ WHERE ID = '${id}'`, {
        type: pjmain.QueryTypes.SELECT
    });

    if (data.length > 0) {
        return data;
    } else {
        return new Object();
    }
}

//查询预登记-信托合同要素集合（分页）
let find_app_dfs_zxd_csxtht_by_uuid = async (uuid, xthtbh, wtrqc, offset, pageNumber) => {
    //查询总的记录数
    let number = await dfs.query(`select count(1) NUMBER FROM APP_DFS_ZXD_CSXTHT WHERE relation_uuid = '${uuid}' and (isnull('${xthtbh}','') = '' or xthtbh like '%${xthtbh}%') and (isnull('${wtrqc}','') = '' or wtrqc like '%${wtrqc}%')`, {
        type: pjmain.QueryTypes.SELECT
    });
    let total = number[0]['NUMBER'];

    let rows = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, zytabs,xthtbh,htjz,wtrqc,wtrlx,lxxq_wtr,wtrzjlx,wtrzjhm,htcszje,htcszfe,xtccxz,zjjsbz,wtzjje,wtccdyje,wtcccclx,syrxh,syrmc,syrlx,lxxq_syr,syrzjlx,syrzjhm,syqdm,sfkssyqzh_syr,syqzhbm_syr,syqcsfe,syqcsje,syqqsr,syqjhdqr,syryxlhbs,qksm FROM APP_DFS_ZXD_CSXTHT WHERE relation_uuid = '${uuid}' and (isnull('${xthtbh}','') = '' or xthtbh like '%${xthtbh}%') and (isnull('${wtrqc}','') = '' or wtrqc like '%${wtrqc}%') ORDER BY XTHTBH offset ${offset} row fetch next ${pageNumber} rows only`, {
        type: pjmain.QueryTypes.SELECT
    });

    return {
        total,
        rows
    };
}

//查询预登记-信托合同要素信息
let find_app_dfs_zxd_csxtht_by_id = async (id) => {
    let data = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, zytabs,xthtbh,htjz,wtrqc,wtrlx,lxxq_wtr,wtrzjlx,wtrzjhm,htcszje,htcszfe,xtccxz,zjjsbz,wtzjje,wtccdyje,wtcccclx,syrxh,syrmc,syrlx,lxxq_syr,syrzjlx,syrzjhm,syqdm,sfkssyqzh_syr,syqzhbm_syr,syqcsfe,syqcsje,syqqsr,syqjhdqr,syryxlhbs,qksm FROM APP_DFS_ZXD_CSXTHT WHERE id = ${id}`, {
        type: pjmain.QueryTypes.SELECT
    });

    if (data.length > 0) {
        return data;
    } else {
        return new Object();
    }
}

//查询预登记-银行资金账户要素集合
let find_app_dfs_zxd_yhzjzh_by_uuid = async (uuid) => {
    let data = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,yxzhlx,yxzhhm,yxzhkhyxzxqc,yxzhkhxqc,yxzhzh,bz,khrq FROM APP_DFS_ZXD_YHZJZH WHERE relation_uuid = '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return new Object();
    }
}

//查询预登记-证券类账户要素集合
let find_app_dfs_zxd_cszqzh_by_uuid = async (uuid) => {
    let data = await dfs.query(`SELECT ID as id, RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode,sfklzqzh,zqzjzhzh,zqgsmc,zqgskhyyb,zqjyxtlx,wgzqjyxtcs,zqzjzhkhrq,sfklqhjyzjzh,qhjyzjzhhm,qhjyzjzhzh,gzqhjybm_tj,gzqhjybm_tqbz,gzqhjybm_tl,qhgsqc,khyyb,qhjyzhkhrq,sfklyxjjyzhzh,zqzhhu_sqs,zqzhzh_sqs,sfdvpjs_sqs,yhjzqzhkhrq_sqs,zqzhhu_zzd,zqzhzh_zzd,sfdvpjs_zzd,yhjzqzhkhrq_zzd FROM APP_DFS_ZXD_CSZQZH WHERE relation_uuid = '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return new Object();
    }
}

//保存初始登记-产品信息要素
let insert_app_dfs_zxd_cscpxx = async (data) => {
    //字段非必输项空值处理
	if(typeof(data.sdbs)=="undefined") data.sdbs = '';
	if(typeof(data.ccqxtcfzr)=="undefined") data.ccqxtcfzr = '';
	if(typeof(data.sfgz)=="undefined") data.sfgz = '';
	if(typeof(data.gljylx)=="undefined") data.gljylx = '';
	if(typeof(data.gllx)=="undefined") data.gllx = '';
	if(typeof(data.ktqshbs)=="undefined") data.ktqshbs = '';
	if(typeof(data.tzgwbs)=="undefined") data.tzgwbs = '';
	if(data.csmjje=='') data.csmjje=null;
	if(data.csmjfe=='') data.csmjfe=null;
	if(data.yqmjzje=='') data.yqmjzje=null;
	if(data.yqmjzfe=='') data.yqmjzfe=null;
	if(data.zdyqsyl=='') data.zdyqsyl=null;
	if(data.xtbcl=='') data.xtbcl=null;
	if(data.xtbc=='') data.xtbc=null;
    let record = await dfs.query(`SELECT id FROM APP_DFS_ZXD_CSCPXX WHERE relation_uuid = '${data.uuid}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    if (record.length > 0) {
		//先删除
		await dfs.query(`update APP_DFS_ZXD_CSCPXX SET djlx='${data.djlx}',xtjgmc='${data.xtjgmc}',cpqc='${data.cpqc}',djcpbh='${data.djcpbh}',gscpbh='${data.gscpbh}',sfxtzcp='${data.sfxtzcp}',sdbs='${data.sdbs}',
				fqzcpnbbh='${data.fqzcpnbbh}',xtccxz='${data.xtccxz}',dyjhbz='${data.dyjhbz}',ccqxtcfzr='${data.ccqxtcfzr}',stzz='${data.stzz}',xtgn='${data.xtgn}',yxfs='${data.yxfs}',
				kffbbs='${data.kffbbs}',xtsyfs='${data.xtsyfs}',syfssm='${data.syfssm}',jghbs='${data.jghbs}',jghyxlhbl='${data.jghyxlhbl}',zjcbs='${data.zjcbs}',totbs='${data.totbs}',
				glmxt='${data.glmxt}',glzxt='${data.glzxt}',csmjje=${data.csmjje},csmjfe=${data.csmjfe},zjjsbz='${data.zjjsbz}',yqmjzje=${data.yqmjzje},yqmjzfe=${data.yqmjzfe},
				yqmjzebz='${data.yqmjzebz}',zyyyly_ctq='${data.zyyyly_ctq}',zytxhy_ctq='${data.zytxhy_ctq}',ccglyyfs='${data.ccglyyfs}',ccglyyfs_ccq='${data.ccglyyfs_ccq}',
				xdzcjsyq='${data.xdzcjsyq}',zczqhbs='${data.zczqhbs}',tsyw='${data.tsyw}',ywxism='${data.ywxism}',syllx='${data.syllx}',zdyqsyl=${data.zdyqsyl},zgyqsyl='${data.zgyqsyl}',
				xtbclx='${data.xtbclx}',xtbcl=${data.xtbcl},xtbc=${data.xtbc},htydbcsm='${data.htydbcsm}',fxxmbs='${data.fxxmbs}',fxtzbs='${data.fxtzbs}',fxczjz='${data.fxczjz}',
				fxhscsnew='${data.fxhscsnew}',fxhscs='${data.fxhscs}',fxczcsbhbcsm='${data.fxczcsbhbcsm}',sfgdqxcp='${data.sfgdqxcp}',xtcpsjclrq='${data.xtcpsjclrq}',cpjhdqr='${data.cpjhdqr}',
				kfpd='${data.kfpd}',shdxzxtj='${data.shdxzxtj}',ktqshbs='${data.ktqshbs}',tjfs='${data.tjfs}',tjmj='${data.tjmj}',ydtjbs='${data.ydtjbs}',xmtjf='${data.xmtjf}',
				sfgz='${data.sfgz}',gzms='${data.gzms}',gzcj='${data.gzcj}',gzjg='${data.gzjg}',jzpgpd='${data.jzpgpd}',jntgjg='${data.jntgjg}',jwtgdljg='${data.jwtgdljg}',
				jwtgdljggb='${data.jwtgdljggb}',tzgwbs='${data.tzgwbs}',tzgwbh='${data.tzgwbh}',grjgbs='${data.grjgbs}',gljybs='${data.gljybs}',gljylx='${data.gljylx}',
				gljybcsm='${data.gljybcsm}',gllx='${data.gllx}',gljymd='${data.gljymd}',gljydj='${data.gljydj}',jzplpd='${data.jzplpd}',zcglbgpd='${data.zcglbgpd}',qsbgplbs='${data.qsbgplbs}',
				xtcpssbm='${data.xtcpssbm}',xtjlxm='${data.xtjlxm}',fggjglry='${data.fggjglry}',lxdh='${data.lxdh}',handle_date='${data.handledate}',over_date='${data.overdate}',
				remark='save',task_code=NULL,update_time=CONVERT(varchar(20),getdate(),120)
				where ID = '${record[0].id}'`)
			.then(function (result) {
                console.log(result);
            })
            .catch(function (error) {
                console.log(error);
            });
	}else{
		//再保存
		await dfs.query(`INSERT INTO APP_DFS_ZXD_CSCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,problem_id,djlx,xtjgmc,cpqc,djcpbh,gscpbh,sfxtzcp,sdbs,fqzcpnbbh,xtccxz,
				dyjhbz,ccqxtcfzr,stzz,xtgn,yxfs,kffbbs,xtsyfs,syfssm,jghbs,jghyxlhbl,zjcbs,totbs,glmxt,glzxt,
				csmjje,csmjfe,zjjsbz,yqmjzje,yqmjzfe,yqmjzebz,zyyyly_ctq,zytxhy_ctq,ccglyyfs,ccglyyfs_ccq,xdzcjsyq,
				zczqhbs,tsyw,ywxism,syllx,zdyqsyl,zgyqsyl,xtbclx,xtbcl,xtbc,htydbcsm,fxxmbs,fxtzbs,fxczjz,fxhscsnew,
				fxhscs,fxczcsbhbcsm,sfgdqxcp,xtcpsjclrq,cpjhdqr,kfpd,shdxzxtj,ktqshbs,tjfs,tjmj,ydtjbs,xmtjf,sfgz,
				gzms,gzcj,gzjg,jzpgpd,jntgjg,jwtgdljg,jwtgdljggb,tzgwbs,tzgwbh,grjgbs,gljybs,gljylx,gljybcsm,gllx,
				gljymd,gljydj,jzplpd,zcglbgpd,qsbgplbs,xtcpssbm,xtjlxm,fggjglry,lxdh,
				remark,input_time,input_user,input_dept,update_time) values(
				'${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.problem_id}','${data.djlx}','${data.xtjgmc}','${data.cpqc}',
				'${data.djcpbh}','${data.gscpbh}','${data.sfxtzcp}','${data.sdbs}','${data.fqzcpnbbh}','${data.xtccxz}','${data.dyjhbz}','${data.ccqxtcfzr}','${data.stzz}',
				'${data.xtgn}','${data.yxfs}','${data.kffbbs}','${data.xtsyfs}','${data.syfssm}','${data.jghbs}','${data.jghyxlhbl}','${data.zjcbs}','${data.totbs}',
				'${data.glmxt}','${data.glzxt}',${data.csmjje},${data.csmjfe},'${data.zjjsbz}',${data.yqmjzje},${data.yqmjzfe},'${data.yqmjzebz}','${data.zyyyly_ctq}',
				'${data.zytxhy_ctq}','${data.ccglyyfs}','${data.ccglyyfs_ccq}','${data.xdzcjsyq}','${data.zczqhbs}','${data.tsyw}','${data.ywxism}','${data.syllx}',
				${data.zdyqsyl},'${data.zgyqsyl}','${data.xtbclx}',${data.xtbcl},${data.xtbc},'${data.htydbcsm}','${data.fxxmbs}','${data.fxtzbs}','${data.fxczjz}',
				'${data.fxhscsnew}','${data.fxhscs}','${data.fxczcsbhbcsm}','${data.sfgdqxcp}','${data.xtcpsjclrq}','${data.cpjhdqr}','${data.kfpd}','${data.shdxzxtj}',
				'${data.ktqshbs}','${data.tjfs}','${data.tjmj}','${data.ydtjbs}','${data.xmtjf}','${data.sfgz}','${data.gzms}','${data.gzcj}','${data.gzjg}','${data.jzpgpd}',
				'${data.jntgjg}','${data.jwtgdljg}','${data.jwtgdljggb}','${data.tzgwbs}','${data.tzgwbh}','${data.grjgbs}','${data.gljybs}','${data.gljylx}','${data.gljybcsm}',
				'${data.gllx}','${data.gljymd}','${data.gljydj}','${data.jzplpd}','${data.zcglbgpd}','${data.qsbgplbs}','${data.xtcpssbm}','${data.xtjlxm}','${data.fggjglry}',
				'${data.lxdh}','${data.remark}','${data.input_time}','${data.input_user}','${data.input_dept}','${data.update_time}'
			)`)
			.then(function (result) {
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
}

//保存预登记-交易对手要素
let insert_app_dfs_zxd_csjyds = async (data) => {
    let code = "";

    if (data.id == "0") {
        await dfs.query(`INSERT INTO APP_DFS_ZXD_CSJYDS(relation_uuid,task_code,regitem_id,product_id,product_code,jydsjgzzjgdm,jydsjglx,jydsjgzclb) values(
            '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.jydsjgzzjgdm}','${data.jydsjglx}','${data.jydsjgzclb}'
        )`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        await dfs.query(`UPDATE APP_DFS_ZXD_CSJYDS SET jydsjgzzjgdm='${data.jydsjgzzjgdm}',jydsjglx='${data.jydsjglx}',jydsjgzclb='${data.jydsjgzclb}' WHERE ID=${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    }

    return {code};
}

//删除预登记-交易对手要素
let delete_app_dfs_zxd_csjyds = async (data) => {
    let code = "";

    if (data.id != "0") {
        await dfs.query(`DELETE FROM APP_DFS_ZXD_CSJYDS WHERE ID=${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        code = "3";
    }

    return {code};
}

//保存预登记-受益权结构要素集合
let insert_app_dfs_zxd_cssyq = async (data) => {
    if(data.syqxh=='') data.syqxh=null;
    if(data.fpsx=='') data.fpsx=null;
	if(data.syqyqsyl=='') data.syqyqsyl=null;
    let code = "";

    if (data.id == "0") {
        await dfs.query(`INSERT INTO APP_DFS_ZXD_CSSYQ(relation_uuid,task_code,regitem_id,product_id,product_code,syqxh, syqdm, syqlx, fpsx, syqsyllx, syqyqsyl, yqsylsm, fhfs, fpfs, fppl) values(
            '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}',${data.syqxh}, '${data.syqdm}', '${data.syqlx}', ${data.fpsx}, '${data.syqsyllx}', ${data.syqyqsyl}, '${data.yqsylsm}', '${data.fhfs}', '${data.fpfs}', '${data.fppl}'
        )`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        await dfs.query(`update APP_DFS_ZXD_CSSYQ set
                                                    syqxh = ${data.syqxh},
                                                    syqdm = '${data.syqdm}',
                                                    syqlx = '${data.syqlx}',
                                                    fpsx = ${data.fpsx},
                                                    syqsyllx = '${data.syqsyllx}',
                                                    syqyqsyl = ${data.syqyqsyl},
                                                    yqsylsm = '${data.yqsylsm}',
                                                    fhfs = '${data.fhfs}',
                                                    fpfs = '${data.fpfs}',
                                                    fppl = '${data.fppl}'
                                                    where id = ${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    }
    
    return {code};
}

//删除预登记-受益权结构要素集合
let delete_app_dfs_zxd_cssyq = async (data) => {
    let code = "";

    if (data.id != "0") {
        await dfs.query(`DELETE FROM APP_DFS_ZXD_CSSYQ WHERE ID = ${data.id}
            `)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        code = "3";
    }
    
    return {code};
}

//保存预登记-信托合同要素集合
let insert_app_dfs_zxd_csxtht = async (data) => {
    if(data.htcszje=='') data.htcszje=null;
    if(data.htcszfe=='') data.htcszfe=null;
    if(data.wtzjje=='') data.wtzjje=null;
    if(data.wtccdyje=='') data.wtccdyje=null;
    if(data.syrxh=='') data.syrxh=null;
    if(data.syqcsfe=='') data.syqcsfe=null;
    if(data.syqcsje=='') data.syqcsje=null;

    let code = "";

    if (data.id == "0") {
        await dfs.query(`INSERT INTO APP_DFS_ZXD_CSXTHT(relation_uuid,task_code,regitem_id,product_id,product_code,zytabs,xthtbh,htjz,wtrqc,wtrlx,lxxq_wtr,wtrzjlx,wtrzjhm,htcszje,htcszfe,xtccxz,zjjsbz,wtzjje,wtccdyje,wtcccclx,syrxh,syrmc,syrlx,lxxq_syr,syrzjlx,syrzjhm,syqdm,sfkssyqzh_syr,syqzhbm_syr,syqcsfe,syqcsje,syqqsr,syqjhdqr,syryxlhbs,qksm) values(
                '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.zytabs}','${data.xthtbh}','${data.htjz}','${data.wtrqc}','${data.wtrlx}','${data.lxxq_wtr}','${data.wtrzjlx}','${data.wtrzjhm}',${data.htcszje},${data.htcszfe},'${data.xtccxz}','${data.zjjsbz}',${data.wtzjje},${data.wtccdyje},'${data.wtcccclx}',${data.syrxh},'${data.syrmc}','${data.syrlx}','${data.lxxq_syr}','${data.syrzjlx}','${data.syrzjhm}','${data.syqdm}','${data.sfkssyqzh_syr}','${data.syqzhbm_syr}',${data.syqcsfe},${data.syqcsje},'${data.syqqsr}','${data.syqjhdqr}','${data.syryxlhbs}','${data.qksm}'
            )`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        await dfs.query(`update APP_DFS_ZXD_CSXTHT set
                                                    zytabs           = '${data.zytabs}',
                                                    xthtbh           = '${data.xthtbh}',
                                                    htjz             = '${data.htjz}',
                                                    wtrqc            = '${data.wtrqc}',
                                                    wtrlx            = '${data.wtrlx}',
                                                    lxxq_wtr         = '${data.lxxq_wtr}',
                                                    wtrzjlx          = '${data.wtrzjlx}',
                                                    wtrzjhm          = '${data.wtrzjhm}',
                                                    htcszje          = ${data.htcszje},
                                                    htcszfe          = ${data.htcszfe},
                                                    xtccxz           = '${data.xtccxz}',
                                                    zjjsbz           = '${data.zjjsbz}',
                                                    wtzjje           = ${data.wtzjje},
                                                    wtccdyje         = ${data.wtccdyje},
                                                    wtcccclx         = '${data.wtcccclx}',
                                                    syrxh            = ${data.syrxh},
                                                    syrmc            = '${data.syrmc}',
                                                    syrlx            = '${data.syrlx}',
                                                    lxxq_syr         = '${data.lxxq_syr}',
                                                    syrzjlx          = '${data.syrzjlx}',
                                                    syrzjhm          = '${data.syrzjhm}',
                                                    syqdm            = '${data.syqdm}',
                                                    sfkssyqzh_syr    = '${data.sfkssyqzh_syr}',
                                                    syqzhbm_syr      = '${data.syqzhbm_syr}',
                                                    syqcsfe          = ${data.syqcsfe},
                                                    syqcsje          = ${data.syqcsje},
                                                    syqqsr           = '${data.syqqsr}',
                                                    syqjhdqr         = '${data.syqjhdqr}',
                                                    syryxlhbs        = '${data.syryxlhbs}',
                                                    qksm             = '${data.qksm}'
                                                    where id         = ${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    }
    
    return {code};
}

//删除预登记-信托合同要素集合
let delete_app_dfs_zxd_csxtht = async (data) => {
    let code = "";

    if (data.id != "0") {
        await dfs.query(`DELETE FROM APP_DFS_ZXD_CSXTHT WHERE ID = ${data.id}
            `)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        code = "3";
    }
    
    return {code};
}

//保存预登记-银行资金账户要素集合
let insert_app_dfs_zxd_yhzjzh = async (data) => {
    let code = "";

    if (data.id == "0") {
        await dfs.query(`INSERT INTO APP_DFS_ZXD_YHZJZH(relation_uuid,task_code,regitem_id,product_id,product_code,yxzhlx,yxzhhm,yxzhkhyxzxqc,yxzhkhxqc,yxzhzh,bz,khrq) values(
                '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.yxzhlx}','${data.yxzhhm}','${data.yxzhkhyxzxqc}','${data.yxzhkhxqc}','${data.yxzhzh}','${data.bz}','${data.khrq}'
            )`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        await dfs.query(`UPDATE APP_DFS_ZXD_YHZJZH SET yxzhlx='${data.yxzhlx}',
                                                        yxzhhm='${data.yxzhhm}',
                                                        yxzhkhyxzxqc='${data.yxzhkhyxzxqc}',
                                                        yxzhkhxqc='${data.yxzhkhxqc}',
                                                        yxzhzh='${data.yxzhzh}',
                                                        bz='${data.bz}',
                                                        khrq='${data.khrq}'
                                                        WHERE ID=${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    }

    return {code};
}

//删除预登记-银行资金账户要素集合
let delete_app_dfs_zxd_yhzjzh = async (data) => {
    let code = "";

    if (data.id != "0") {
        await dfs.query(`DELETE FROM APP_DFS_ZXD_YHZJZH WHERE ID=${data.id}`)
            .then(function (result) {
                code = "1";
            })
            .catch(function (error) {
                code = "2";
            });
    } else {
        code = "3";
    }

    return {code};
}

//保存预登记-证券类账户要素集合
let insert_app_dfs_zxd_cszqzh = async (data) => {
    let code = "";
    await dfs.query(`UPDATE APP_DFS_ZXD_CSZQZH SET sfklzqzh='${data.sfklzqzh}',
                                                    zqzjzhzh='${data.zqzjzhzh}',
                                                    zqgsmc='${data.zqgsmc}',
                                                    zqgskhyyb='${data.zqgskhyyb}',
                                                    zqjyxtlx='${data.zqjyxtlx}',
                                                    wgzqjyxtcs='${data.wgzqjyxtcs}',
                                                    zqzjzhkhrq='${data.zqzjzhkhrq}',
                                                    sfklqhjyzjzh='${data.sfklqhjyzjzh}',
                                                    qhjyzjzhhm='${data.qhjyzjzhhm}',
                                                    qhjyzjzhzh='${data.qhjyzjzhzh}',
                                                    gzqhjybm_tj='${data.gzqhjybm_tj}',
                                                    gzqhjybm_tqbz='${data.gzqhjybm_tqbz}',
                                                    gzqhjybm_tl='${data.gzqhjybm_tl}',
                                                    qhgsqc='${data.qhgsqc}',
                                                    khyyb='${data.khyyb}',
                                                    qhjyzhkhrq='${data.qhjyzhkhrq}',
                                                    sfklyxjjyzhzh='${data.sfklyxjjyzhzh}',
                                                    zqzhhu_sqs='${data.zqzhhu_sqs}',
                                                    zqzhzh_sqs='${data.zqzhzh_sqs}',
                                                    sfdvpjs_sqs='${data.sfdvpjs_sqs}',
                                                    yhjzqzhkhrq_sqs='${data.yhjzqzhkhrq_sqs}',
                                                    zqzhhu_zzd='${data.zqzhhu_zzd}',
                                                    zqzhzh_zzd='${data.zqzhzh_zzd}',
                                                    sfdvpjs_zzd='${data.sfdvpjs_zzd}',
                                                    yhjzqzhkhrq_zzd='${data.yhjzqzhkhrq_zzd}'
                                                    WHERE ID=${data.id}`)
        .then(function (result) {
            code = "1";
        })
        .catch(function (error) {
            code = "2";
        });
    
    return {code};
}

//查询终止登记-产品信息要素
let find_app_dfs_zxd_zzcpxx_by_regitem_id = async (regitem_id) => {
    //根据节点ID获取事务ID
    let arr = regitem_id.split("@@");
    regitem_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + regitem_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            regitem_id = task_info[0].affa_id;
        }
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, TASK_CODE as bsid, REGITEM_ID as regitem_id,PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
					 xtjgmc, djcpbh, cpqc, qsrq, sfaydrqqs, ssxtje, xtbjljgfe, xtsyljfpe, tgljgdbc, tgljyjbc, strljgdbc,handle_date handledate,over_date overdate,
					 strljyjbc, sjxtbcl, xtfyze, xtfyl, xtbgfl, sjsy, sjsyl, sshje, shsje, pfje, ywxxsm, task_state, remark, input_time, input_user, input_dept, update_time 
					 FROM APP_DFS_ZXD_ZZCPXX WHERE problem_id = '${regitem_id}'`, {
				type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		}
    }else if (arr[0] == "1") {
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, TASK_CODE as bsid, REGITEM_ID as regitem_id,PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
					 xtjgmc, djcpbh, cpqc, qsrq, sfaydrqqs, ssxtje, xtbjljgfe, xtsyljfpe, tgljgdbc, tgljyjbc, strljgdbc,handle_date handledate,over_date overdate,
					 strljyjbc, sjxtbcl, xtfyze, xtfyl, xtbgfl, sjsy, sjsyl, sshje, shsje, pfje, ywxxsm, task_state, remark, input_time, input_user, input_dept, update_time 
					 FROM APP_DFS_ZXD_ZZCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
				type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		} else {
			//先采集
			await dfs.query(`exec SP_CHANGE_ZZDJ_CPXX_03 ${regitem_id} `);
			//再返回
			let data = await dfs.query(`SELECT RELATION_UUID as uuid, TASK_CODE as bsid, REGITEM_ID as regitem_id,PRODUCT_ID as productid, PRODUCT_CODE as productcode,problem_id,
					 xtjgmc, djcpbh, cpqc, qsrq, sfaydrqqs, ssxtje, xtbjljgfe, xtsyljfpe, tgljgdbc, tgljyjbc, strljgdbc,handle_date handledate,over_date overdate,
					 strljyjbc, sjxtbcl, xtfyze, xtfyl, xtbgfl, sjsy, sjsyl, sshje, shsje, pfje, ywxxsm, task_state, remark, input_time, input_user, input_dept, update_time 
					 FROM APP_DFS_ZXD_ZZCPXX WHERE regitem_id = '${regitem_id}' AND ISNULL(TASK_STATE,'')=''`, {
				type: pjmain.QueryTypes.SELECT
			});
			if (data.length > 0) {
				return data[0];
			} else {
				return new Object();
			}
		}
	}
}

//保存终止登记-产品信息要素
let insert_app_dfs_zxd_zzcpxx = async (data) => {
	if(data.tgljgdbc=='') data.tgljgdbc=null;
	if(data.tgljyjbc=='') data.tgljyjbc=null;
	if(data.strljyjbc=='') data.strljyjbc=null;
	if(data.sshje=='') data.sshje=null;
	if(data.shsje=='') data.shsje=null;
	if(data.pfje=='') data.pfje=null;
    let record = await dfs.query(`SELECT id FROM APP_DFS_ZXD_ZZCPXX WHERE relation_uuid = '${data.uuid}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    if (record.length > 0) {	
		//先更新	
		await dfs.query(`update APP_DFS_ZXD_ZZCPXX set xtjgmc='${data.xtjgmc}',djcpbh='${data.djcpbh}',cpqc='${data.cpqc}',qsrq='${data.qsrq}',sfaydrqqs='${data.sfaydrqqs}',
				ssxtje=${data.ssxtje},xtbjljgfe=${data.xtbjljgfe},xtsyljfpe=${data.xtsyljfpe},tgljgdbc=${data.tgljgdbc},tgljyjbc=${data.tgljyjbc},strljgdbc=${data.strljgdbc},
				sjxtbcl=${data.sjxtbcl},xtfyze=${data.xtfyze},xtfyl=${data.xtfyl},strljyjbc=${data.strljyjbc},xtbgfl=${data.xtbgfl},sjsy=${data.sjsy},
				sjsyl=${data.sjsyl},sshje=${data.sshje},shsje=${data.shsje},pfje=${data.pfje},ywxxsm='${data.ywxxsm}',handle_date='${data.handledate}',over_date='${data.overdate}',
				remark='save',task_code=NULL,update_time=CONVERT(varchar(20),getdate(),120)
				WHERE id = '${record[0].id}'`);
	}else{
    //再保存
    await dfs.query(`INSERT INTO APP_DFS_ZXD_ZZCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,problem_id,xtjgmc,djcpbh,cpqc,qsrq,sfaydrqqs,ssxtje,xtbjljgfe,xtsyljfpe,tgljgdbc,
        tgljyjbc,strljgdbc,strljyjbc,sjxtbcl,xtfyze,xtfyl,xtbgfl,sjsy,sjsyl,sshje,shsje,pfje,ywxxsm,remark,input_time,input_user,input_dept,update_time) values(
            '${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.problem_id}','${data.xtjgmc}','${data.djcpbh}','${data.cpqc}','${data.qsrq}','${data.sfaydrqqs}',${data.ssxtje},${data.xtbjljgfe},${data.xtsyljfpe},${data.tgljgdbc},${data.tgljyjbc},${data.strljgdbc},${data.strljyjbc},${data.sjxtbcl},${data.xtfyze},${data.xtfyl},${data.xtbgfl},${data.sjsy},${data.sjsyl},${data.sshje},${data.shsje},${data.pfje},'${data.ywxxsm}','${data.remark}','${data.input_time}','${data.input_user}','${data.input_dept}','${data.update_time}'
        )`)
        .then(function (result) {
            console.log(result);
        })
        .catch(function (error) {
            console.log(error);
        });
	}
}

//查询事前报告-产品信息要素
let find_app_dfs_zxd_sqcpxx_regitem_id = async (regitem_id) => {
    //根据节点ID获取事务ID
    let arr = regitem_id.split("@@");
    regitem_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + regitem_id + `'`, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            regitem_id = task_info[0].affa_id;
        }
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, problem_id,
					xtjgmc, xtxmmc, djcpbh, csxtcclx, dyjhbz, sfgljy, sqbgyy, xtjlxm, xtjldh, fggjglry, handle_date handledate,over_date overdate,remark, input_time, input_user, input_dept, update_time
					FROM APP_DFS_ZXD_SQCPXX WHERE problem_id = '${regitem_id}'`, {
        type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		}
    }else if (arr[0] == "1") {
		let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, problem_id,
					xtjgmc, xtxmmc, djcpbh, csxtcclx, dyjhbz, sfgljy, sqbgyy, xtjlxm, xtjldh, fggjglry, handle_date handledate,over_date overdate,remark, input_time, input_user, input_dept, update_time
					FROM APP_DFS_ZXD_SQCPXX WHERE regitem_id = '${regitem_id}' and isnull(TASK_STATE,'')=''`, {
        type: pjmain.QueryTypes.SELECT
		});
		if (data.length > 0) {
			return data[0];
		} else {
			//先采集
			await dfs.query(`exec SP_CHANGE_SJBG_CPXX_04 ${regitem_id} `);
			//再返回
			let data = await dfs.query(`SELECT RELATION_UUID as uuid, REGITEM_ID as regitem_id, TASK_CODE as bsid, PRODUCT_ID as productid, PRODUCT_CODE as productcode, problem_id,
							xtjgmc, xtxmmc, djcpbh, csxtcclx, dyjhbz, sfgljy, sqbgyy, xtjlxm, xtjldh, fggjglry, handle_date handledate,over_date overdate,remark, input_time, input_user, input_dept, update_time
							FROM APP_DFS_ZXD_SQCPXX WHERE regitem_id = '${regitem_id}' and isnull(TASK_STATE,'')=''`, {
				type: pjmain.QueryTypes.SELECT
			});
			if (data.length > 0) {
				return data[0];
			} else {
				return new Object();
			}
		}
	}
}

//保存事前报告-产品信息要素
let insert_app_dfs_zxd_sqcpxx = async (data) => {
    let record = await dfs.query(`SELECT id FROM APP_DFS_ZXD_SQCPXX WHERE relation_uuid = '${data.uuid}'`, {
        type: pjmain.QueryTypes.SELECT
    });
    if (record.length > 0) {	
		//先更新
		await dfs.query(`UPDATE APP_DFS_ZXD_SQCPXX set xtjgmc='${data.xtjgmc}',xtxmmc='${data.xtxmmc}',djcpbh='${data.djcpbh}',csxtcclx='${data.csxtcclx}',dyjhbz='${data.dyjhbz}',
				sfgljy='${data.sfgljy}',sqbgyy='${data.sqbgyy}',xtjlxm='${data.xtjlxm}',xtjldh='${data.xtjldh}',fggjglry='${data.fggjglry}',handle_date='${data.handledate}',over_date='${data.overdate}',
				REMARK='save',task_code=NULL,update_time=CONVERT(varchar(20),getdate(),120)
				WHERE id = '${record[0].id}'`)
			.then(function (result) {
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});				
	}else{ 
		//再保存
		await dfs.query(`INSERT INTO APP_DFS_ZXD_SQCPXX(relation_uuid,task_code,regitem_id,product_id,product_code,problem_id,xtjgmc,xtxmmc,djcpbh,csxtcclx,dyjhbz,sfgljy,sqbgyy,xtjlxm,xtjldh,fggjglry,remark,input_time,input_user,input_dept,update_time) values(
				'${data.uuid}','${data.bsid}',${data.regitem_id},${data.productid},'${data.productcode}','${data.problem_id}','${data.xtjgmc}','${data.xtxmmc}','${data.djcpbh}',
				'${data.csxtcclx}','${data.dyjhbz}','${data.sfgljy}','${data.sqbgyy}','${data.xtjlxm}','${data.xtjldh}','${data.fggjglry}',
				'${data.remark}','${data.input_time}','${data.input_user}','${data.input_dept}','${data.update_time}'
			)`)
			.then(function (result) {
				console.log(result);
			})
			.catch(function (error) {
				console.log(error);
			});
	}
}

//查询预登记-产品信息要素-详情
let query_app_dfs_zxd_ydjcpxx = async (regitem_id) => {
    //根据节点ID获取事务ID
    let affa_id = "";
    let arr = regitem_id.split("@@");
    affa_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            affa_id = task_info[0].affa_id;
        }
    }
    
    if (affa_id != "") {
        let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_ydjcpxx '` + affa_id + `'  `, {
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
    //根据节点ID获取事务ID
    let affa_id = "";
    let arr = regitem_id.split("@@");
    affa_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            affa_id = task_info[0].affa_id;
        }
    }
    
    if (affa_id != "") {
        let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_zzcpxx '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        return project_info[0];
    } else {
        return '';
    }
}

//查询事前登记-产品信息-详情
let query_app_dfs_zxd_sqcpxx = async (regitem_id) => {
    //根据节点ID获取事务ID
    let affa_id = "";
    let arr = regitem_id.split("@@");
    affa_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            affa_id = task_info[0].affa_id;
        }
    }
    
    if (affa_id != "") {
        let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_sqcpxx '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        return project_info[0];
    } else {
        return '';
    }
}

//查询初始登记-产品信息要素-详情
let query_app_dfs_zxd_cscpxx = async (regitem_id) => {
    //根据节点ID获取事务ID
    let affa_id = "";
    let arr = regitem_id.split("@@");
    affa_id = arr[1];
    if (arr[0] == "2") {
        let task_info = await pjmain.query(`select affa_id from pjmain..wf_task where task_id = '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        if (task_info.length > 0) {
            affa_id = task_info[0].affa_id;
        }
    }
    
    if (affa_id != "") {
        let project_info = await dfs.query(`exec sp_query_app_dfs_zxd_cscpxx '` + affa_id + `'  `, {
            type: pjmain.QueryTypes.SELECT
        });
        return project_info[0];
    } else {
        return new Object();
    }
}

//查询初始登记-初始交易对手-详情
let query_app_dfs_zxd_csjyds = async (uuid) => {
    let data = await dfs.query(`exec sp_query_app_dfs_zxd_csjyds '${uuid}' `, {
        type: pjmain.QueryTypes.SELECT
    });
    if (data.length > 0) {
        return data;
    } else {
        return new Object();
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
        return new Object();
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
        return new Object();
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
        return new Object();
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
        return new Object();
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
    find_app_dfs_zxd_csjyds_by_uuid: find_app_dfs_zxd_csjyds_by_uuid,
    find_app_dfs_zxd_cssyq_by_uuid: find_app_dfs_zxd_cssyq_by_uuid,
    find_app_dfs_zxd_cssyq_by_id: find_app_dfs_zxd_cssyq_by_id,
    find_app_dfs_zxd_csxtht_by_uuid: find_app_dfs_zxd_csxtht_by_uuid,
    find_app_dfs_zxd_csxtht_by_id: find_app_dfs_zxd_csxtht_by_id,
    find_app_dfs_zxd_yhzjzh_by_uuid: find_app_dfs_zxd_yhzjzh_by_uuid,
    find_app_dfs_zxd_cszqzh_by_uuid: find_app_dfs_zxd_cszqzh_by_uuid,
    insert_app_dfs_zxd_cscpxx: insert_app_dfs_zxd_cscpxx,
    insert_app_dfs_zxd_csjyds: insert_app_dfs_zxd_csjyds,
    delete_app_dfs_zxd_csjyds: delete_app_dfs_zxd_csjyds,
    insert_app_dfs_zxd_cssyq: insert_app_dfs_zxd_cssyq,
    delete_app_dfs_zxd_cssyq: delete_app_dfs_zxd_cssyq,
    insert_app_dfs_zxd_csxtht: insert_app_dfs_zxd_csxtht,
    delete_app_dfs_zxd_csxtht: delete_app_dfs_zxd_csxtht,
    insert_app_dfs_zxd_yhzjzh: insert_app_dfs_zxd_yhzjzh,
    delete_app_dfs_zxd_yhzjzh: delete_app_dfs_zxd_yhzjzh,
    insert_app_dfs_zxd_cszqzh: insert_app_dfs_zxd_cszqzh,
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