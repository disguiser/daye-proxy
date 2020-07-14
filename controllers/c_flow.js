'use strict';
const temple = require('../utils/temple.js');
const d_flow = require('../dao/d_flow.js');
const d_attachment = require('../dao/d_attachment.js');
const dict_file_type = require('../dicts/dict_file_type');
const dict_yes_or_no = require('../dicts/dict_yes_or_no');
const d_dict = require('../dao/d_dict.js');
const tools = require('../utils/tools.js');
const moment = require('moment');
const fs = require('mz/fs');
// const accounting = require('accounting-js');
// const nzhcn = require('nzh').cn;

// 字典,用于映射
let flow_regitem = {
    // 合同审批流程
    afad680f3ec711e6ae92184f32ca6bca: {
        XTWJMC: 'x7857b1e3ebc11e68228184f32ca6bca' // 信托文件
    },
    // 合同审批流程(非实质性变更)
    d70e099e240411e7a3af005056a687a8: {
        XTWJMC: 'w7824b2650e711e79fa3000c294af360' // 信托文件
    },
    // 信托登记审批流程
    ab6e048f3e6211e68067184f32ca6bca: {
        regitem_id: 'xba795f0539611e6a226b888e335e00a' // 信托文件
    },
    rdf83711470311e68bb0184f32ca6bca: {
        regitem_id: 'wb14720059e311e6adbef0def1c335c3'
    },
    o53659213e5c11e6a7bd184f32ca6bca: {
        regitem_id: 'd7fbd530789311e6a510184f32ca6bca',
        json_data: 'c832fa5170e311e68db8184f32ca6bca'
    },
    eebf606e3e6411e68f15184f32ca6bca: {
        regitem_id: 'v78cb1a16f4311e6a83340f02f0658fc'
    },
    p0cf06613e8e11e680a2184f32ca6bca: {
        regitem_id: 'o6587480546111e6ac90b888e335e00a'
    },
    x0e79ca1470711e69bce184f32ca6bca: {
        regitem_id: 'ba2f776159e311e6b245f0def1c335c3'
    },
    wfee86703bb611e7ae5d000c294af360: {
        regitem_id: 't2481c3059e111e68f3bf0def1c335c3'
    },
    od1bb94f470811e6ac64184f32ca6bca: {
        regitem_id: 'd85e0f3059e311e6993bf0def1c335c3'
    },
    v4b02a4f3e8a11e6ac80184f32ca6bca: { // 资产解押审批流程
        regitem_id: 'xcd1b98f59e211e6b633f0def1c335c3',
        JXZC: 'eb4692f03e9c11e6b807184f32ca6bca', // 解押/解约财产
        XYYSCLQD: 'fa9185803e9c11e68dd0184f32ca6bca' // 需要用印材料清单
    },
    s8555e40476611e7a73d000c294af360: {
        regitem_id: 'f135b2f84c3711e7ba6b000c294af360'
    },
    ta32efd13e8c11e6ae36184f32ca6bca: { // 受益权转让审批流程
        regitem_id: 'w2b93c1e092f11e78e55005056a60fd8'
    },
    v93e92803bb611e787b3000c294af360: { // 消费贷款放款
        regitem_id: 't2481c3059e111e68f3bf0def1c335c3'
    },
    pfb34fc0471111e6a77b184f32ca6bca: { // 信托资金/销售资金监管使用申请流程
        regitem_id: 'fb5fcf5e59e211e683acf0def1c335c3'
    },
    b5792af0470e11e68438184f32ca6bca: { // 用印审批流程
        APPROVALSELA: 'w240a48f41b511e79398000c294af360',
        regitem_id: 'sa87f08f59e311e6b81ff0def1c335c3'
    },
    xca765cf519611e79e8d005056a687a8: { // 抵质押权利证书(证明)领用审批
        regitem_id: 'q9bd48de516f11e79ac9005056a687a8'
    },
    q28638b01a2311e998fd005056a61cf9: { // 他项权利证书（证明）移交
        regitem_id: 'a309c0cf8d7b11e99af8005056a6a83a',
        ZSXX: 'o6fd6b308e5011e9afa4005056a6a83a' // 证书信息
    },
    v26e5061032b11e9bf71005056a61cf9: { // 营销费用结算
        regitem_id: 't7269530f90111e8a720005056a6a83a'
    },
    cae5cd5e01e411e9ab26005056a61cf9: { // 不良资产处置中介选聘审批流程
        regitem_id: 'bd128ab0ff4711e8845c005056a61cf9',
        LAWYER: 't31d56c0ff4811e8baad005056a61cf9' // 主要服务律师
    },
    dd924830ff7811e88cd9005056a61cf9: { // 不良资产处置方案签报审批流程
        regitem_id: 'q5fd64a1ff7511e8804b005056a61cf9' 
    },
    e31972c001f211e9b102005056a61cf9: { // 不良资产处置重大事项签报审批流程
        regitem_id: 'd1424d82ff7511e898bd005056a61cf9' 
    },
    oa3982e101f411e9a455005056a61cf9: { // 不良资产处置信息汇报流程
        regitem_id: 'w1a92592ff7611e89fbb005056a61cf9' 
    },
    c722681e519411e78b64005056a687a8: { // 信托合同交接记录(集合)
        regitem_id: 'f3461aee519e11e78d3b005056a687a8'
    },
    f92d6e211fe711e7bca7005056a687a8: { // 清算报告审批单
        regitem_id: 'qa29b430b77d11e6b6e460d819cae7ab'
    },
    t4cd0f403e8b11e6ad89184f32ca6bca: { // 清算报告审批单
        regitem_id: 't879ff4f59e211e69feff0def1c335c3'
    },
    uf14d630211011e898a0005056a687a8: { // 信托收益账户变更流程(2018-3-14添加该段）
        regitem_id: 'ob44059e275911e88134000c294af360'
    },
    sae22ba150d211e79ce6005056a687a8: { // 受益权转让审批流程(集合)
        regitem_id: 'qa092dee50ca11e79044005056a687a8'
    },
    q1bd287010c411e989cd005056a61cf9: { // 信托项目预审评审意见表决流程
        regitem_id: 'rd2683e9101611e9b1c6005056a6a83a'
    },
    qf979b0f10c411e98c20005056a61cf9: { // 信托项目终审评审意见书
        regitem_id: 'rd2683e9101611e9b1c6005056a6a83a'
    },
    daf2bbc01a1f11e9a719005056a61cf9: { // 法人签字登记流程
        regitem_id: 'r652c05e124f11e9857c005056a6a83a',
        FILE: 'd4ef26ee124f11e9b2ad005056a6a83a' // 文件
    },
    wa456c0f1a1d11e9b1af005056a61cf9: { // 产品发行流程(非事务)
        regitem_id: 'cc3204b0147511e987c9005056a6a83a',
    },
    t3075f5e657211e982fc005056a61cf9: { // 中后期管理报告流程
        regitem_id: 'we748ab04f6e11e9ae72005056a6a83a',
    },
    // 业务档案归档交接流程
    c1cf5f0f8be711e98947005056a6a83a: {
        regitem_id: 'r1f824008c0d11e9aa8e005056a6a83a',
        GDZL: 'cfbec4008c0d11e98608005056a6a83a' // 归档资料明细
    },
    s829d3618dd211e9ada9005056a61cf9: { // 中介机构（律师/审计/评估）聘用审批流程
        regitem_id: 'x882aecf810d11e995ec005056a6a83a',
        PERSON: 'c9fc049e810f11e985ed005056a6a83a' // 服务律师/服务会计师/评估师
        
    },
    f4805a40ba3b11e9af01005056a6a83a: { // 客户限额及集中度占用备案审批
        regitem_id: 'q91dcbde7aa211e988c6005056a6a83a'
    },
    s25933617aa711e99d9e005056a6a83a: { // 客户评级及限额测试审批流程
        regitem_id: 'q91dcbde7aa211e988c6005056a6a83a'
    },
    oc987c8f7dea11e9bcc3005056a6a83a: { // 客户集中度标准调整审批单
        regitem_id: 'q91dcbde7aa211e988c6005056a6a83a'
    }
    //d30aa0dea29711e79897000c294af360: { // 房屋抵押贷款用印申请流程
        //regitem_id: 'c740c958a29811e79ab5000c294af360'
    //}
}
let attaRebuild = async (ctx, json_attachments) => {
    let flow_list_ids = [];
    json_attachments.forEach(e => {
        //console.log(e.LIST_UUID);
        flow_list_ids.push(e.LIST_UUID);
    });
    console.log("++++++++++++++++flow_list_ids++++++++++++++++++++++");
    console.log(flow_list_ids);
    if (flow_list_ids.length == 0) {
        return;
    }
    let attachments = await d_attachment.find_by_flis(flow_list_ids);
    if (attachments.length == 0) {
        return;
    }
    // 去除冗余
    let _attachments = await d_attachment.find_by_ti(attachments[0].temp_id);
    ctx.logger.debug(JSON.stringify(attachments));
    ctx.logger.debug(JSON.stringify(_attachments));
    if (_attachments.length > attachments.length) {
        let ids = [],
            file_paths;
        _attachments.forEach((e, i) => {
            if (flow_list_ids.indexOf(e.flow_list_id) < 0) {
                ids.push(e.ID);
                fs.unlink(e.file_path);
            }
        });
        await d_attachment.delete_by_ids(ctx, ids);
    }
    // console.log(attachments);
    // 根据flow_list_id分组
    let attach_rebuild = {};
    attach_rebuild['temp_id'] = attachments[0] === undefined ? '' : attachments[0].temp_id
    attachments.forEach(element => {
        if( attach_rebuild[element.flow_list_id] == undefined){
            attach_rebuild[element.flow_list_id] = new Array();
            attach_rebuild[element.flow_list_id].push(element);
        }else{
            attach_rebuild[element.flow_list_id].push(element);
        }
    });
    ctx.logger.debug("attach_rebuild", JSON.stringify(attach_rebuild));
    console.log("++++++++++++++++attach_rebuild++++++++++++++++++++++");
    console.log(attach_rebuild);
    return attach_rebuild;
}
let contractApproval = async (ctx, affair) => {
    // 合同审批流程
    let res;
    let json_data = affair.jsondata;
    if(json_data!=''){
        json_data = JSON.parse(json_data);
        // 信托文件
        let intrust_attachments = JSON.parse(json_data[flow_regitem[affair.flow_id]['XTWJMC']]);
        
        let attach_rebuild = await attaRebuild(ctx, intrust_attachments);

        res = {
            success: temple.render('atta_table.html' ,{
                intrust_attachments: intrust_attachments,
                attachments: attach_rebuild,
                dict_file_type: dict_file_type
            })
        };
    } else {
        res = {fail: '未找到对应jsondata'};
    }
    return res;
}
// 产品发行流程
let productDistribution  = async(affair) => {
    // 产品ID
    let regitem_id = JSON.parse(affair.jsondata)['dbc8550ff27a11e6b67a1c3e84e5807c'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let json_data = await d_flow.find_tasks(affair.affa_id, "'T16D12D1A5D3406D9CC65A76AD7691B1','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F'");
    let time1 = await d_flow.find_taskinfo(affair.affa_id, 'T16D12D1A5D3406D9CC65A76AD7691B1');
    let time2 = await d_flow.find_taskinfo(affair.affa_id, 'PBB558EE7E914339B01828AC11437874');
    let time3 = await d_flow.find_taskinfo(affair.affa_id, 'D6887042FAD54274857C6A48018A820F');
    let jbtime ='该节点未处理'
    let zgtime ='该节点未处理'
    let hgtime ='该节点未处理'
    if(time1){
       jbtime = moment(time1['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    if(time2){
       zgtime = moment(time2['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    if(time3){
       hgtime = moment(time3['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    if (json_data.T16D12D1A5D3406D9CC65A76AD7691B1.be3910515f9711e68e53b888e3e688de==1 || 
        json_data.T16D12D1A5D3406D9CC65A76AD7691B1.be3910515f9711e68e53b888e3e688de==0 ||
        json_data.T16D12D1A5D3406D9CC65A76AD7691B1.be3910515f9711e68e53b888e3e688de==2){
        return {
            success: temple.render('fx_table.html', {
                project_info: project_info,
                json_data: json_data,
                dict_yes_or_no: dict_yes_or_no
            })
        };     
    }else{
        return {
            success: temple.render('fx_table_jhsw.html', {
                jbtime: jbtime,
                zgtime: zgtime,
                hgtime: hgtime,
                project_info: project_info,
                json_data: json_data,
                dict_yes_or_no: dict_yes_or_no
            })
        };  
    }
}
// 产品发行流程(非事务)
let cpfxfsw  = async(affair) => {
    // 产品ID
    let regitem_id = JSON.parse(affair.jsondata)['cc3204b0147511e987c9005056a6a83a'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let json_data = await d_flow.find_tasks(affair.affa_id, "'wa4a27021a1d11e9b99d005056a61cf9','wa4a27001a1d11e9a4b6005056a61cf9','wa47dd121a1d11e9a75e005056a61cf9'");
    
    let time1 = await d_flow.find_taskinfo(affair.affa_id, 'wa4a27021a1d11e9b99d005056a61cf9');
    let time2 = await d_flow.find_taskinfo(affair.affa_id, 'wa4a27001a1d11e9a4b6005056a61cf9');
    let time3 = await d_flow.find_taskinfo(affair.affa_id, 'wa47dd121a1d11e9a75e005056a61cf9');
    let jbtime ='该节点未处理'
    let zgtime ='该节点未处理'
    let hgtime ='该节点未处理'
    if(time1){
       jbtime = moment(time1['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    if(time2){
       zgtime = moment(time2['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    if(time3){
       hgtime = moment(time3['exec_time']).format('YYYY-MM-DD HH:mm:ss');
    }
    return {
        success: temple.render('fx_table_fsw.html', {
            jbtime: jbtime,
            zgtime: zgtime,
            hgtime: hgtime,
            project_info: project_info,
            json_data: json_data,
            dict_yes_or_no: dict_yes_or_no,
            affa_id: affair.affa_id
        })
    };
}
// 项目签报变更流程
let sign = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let affair_info = await d_flow.find_affar(affair.affa_id);
    let usercode = parsedJson.b9b96f707d9b11e7a841000c294af360;
    let users = usercode.split(",");
    let user = ''
    for(let j = 0;j < users.length; j++) {
        let username  = await d_flow.find_next_user_for_huiq(users[j]);
         if(user==''){
            user =  username;
         }else{
            user =  user+','+username;
         }
    }
    return {
        success: temple.render('zs_chang_apply.html', {
            project_info: project_info,
            json_data: parsedJson,
            regitem_id: regitem_id,
            user:user,
            affa_id: affair.affa_id,
            affair_info: affair_info

        })
    }
}
// 中后期重大事项签报流程
let importantMatter = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let sign_name = await d_flow.find_sign_name_by_affaid(affair.affa_id);
    return {
        success: temple.render('important_matter.html', {
            project_info: project_info,
            json_data: parsedJson,
            sign_name: sign_name 
        })
    }
}
// 项目签报审批流程
let projectReport = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    let affair_info = await d_flow.find_affar(affair.affa_id);
    return {
        success: temple.render('project_sign.html', {
            project_info: project_info,
            affa_id: affair.affa_id,
            affair_info: affair_info
        })
    };
}
// 项目审批流程
let projectApproval = async(affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    return {
        success: temple.render('project_declare.html', {
            json_data: parsedJson,
            project_info: project_info,
            today: moment().format('YYYY年MM月DD日'),
            affa_id: affair.affa_id
        })
    };
}
// 收款流程 + 付款流程
let receivables = async(affair) => {
    // console.log(affair.jsondata);
    let json_data = JSON.parse(affair.jsondata);
    let node_id = affair.node_id ? affair.node_id : '';
    if (affair.flow_id=='v7608f2e3e8811e688c2184f32ca6bca') { // 收款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printInNotice?in_uuid=${json_data.u948ea80f5b911e68893415645000030}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id=='v11a7d403e8611e6b07e184f32ca6bca'){ // 付款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="100%  !important" src="/x/intrustqlc/views/dy/printPayNotice?pay_uuid=${json_data.c7d2586153c611e6858ab888e335e00a}&affaid=${affair.affa_id}&node_id=${node_id}"></iframe>`
        }
    } else if(affair.flow_id=='fdf2ed804a6411e6905fd85de21f6642'){ // 放款审批流程
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printOutNotice?loan_uuid=${json_data.q6d38600020811e7b242415645000030}&affaid=${affair.affa_id}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id == 'rfb70130910911e6a83c184f32ca6bca') { // 收支计划审批流程
        return {
            success: `<a id="theA" target="_black" href="/x/intrustqlc/views/dy/inPayPlan?affa_id=${affair.affa_id}" >查看收支计划</a>`
        }
    } else if (affair.flow_id == 'wb2eee409a6211e687f3415645000030') { // 工作计划审批流程
        return {
            success: `<a id="theA" target="_black" href="/x/intrustqlc/views/dy/taskPlan?affa_id=${affair.affa_id}" >查看工作计划</a>`
        }
    }
}
let accountOpen = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    affair_json['q48407a1520711e6b198b888e335e00a'] = tools.splitBankNo(affair_json['q48407a1520711e6b198b888e335e00a']) // 格式化
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    // let task_jsons = await d_flow.find_tasks(affair, "'O91D097B848A4CFD934EB2A1848D5D04','UEBA868CD26E4027A05B3D6CB91B4201'");
    let bank_name = await d_flow.find_bank_name(affair_json['aaf42ff0520611e688c2b888e335e00a']);
    return {
        success: temple.render('account_open.html', {
            project_info: project_info,
            product_info: product_info,
            affair_json: affair_json,
            dict_yes_or_no: dict_yes_or_no,
            bank_name: bank_name
        })
    };
}
let accountCancel = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let account_id = affair_json['s64420403ea311e6aebb184f32ca6bca'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    let account_info = await d_flow.find_account_info(account_id);
    let affair_info = await d_flow.find_affar(affair.affa_id);
    affair_json['w83e270fcccf11e6a211005056a687a8'] = tools.splitBankNo(affair_json['w83e270fcccf11e6a211005056a687a8']) //格式化
    account_info['ACCT_BANK_ACCT'] = tools.splitBankNo(account_info['ACCT_BANK_ACCT'])             // 银行账号格式化
    return {
        success: temple.render('account_cancel.html', {
            project_info: project_info,
            product_info: product_info,
            account_info: account_info,
            today:moment(affair_info['create_time']).format('YYYY-MM-DD'),
            affair_json: affair_json
        })
    };
}
// 放款审批流程(消费贷及房抵贷)
let payApply = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let pa_info = await d_flow.find_pay_apply(affair.affa_id);
    let link = affair.flow_id == 'wfee86703bb611e7ae5d000c294af360' ? true : false; 
    return {
        success: temple.render('pay_apply.html', {
            project_info: project_info,
            pa_info: pa_info,
            link: link,
            affair_json:affair_json
        })
    }
}
// 外派人员（含董监事）委派审批流程
let expatriateApply = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('expatriate_apply.html', {
            project_info: project_info,
            json_data: parsedJson,
            json_arr: JSON.parse(parsedJson.e78b34f0472911e684f0184f32ca6bca)
        })
    }
}
// 信托登记审批流程
let xtdjsp = async (affair) => {
    //let parsedJson = JSON.parse(affair.jsondata);
    // let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    // let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xtdjsp.html', {
            json_data: {
                sb: 'sbsbsb'
            }
        })
    }
}
// 外派人员行使表决权审批流程
let xsbjq = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xsbjq.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 资产解押审批流程
let zcjyzysp = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);

    let XYYSCLQD = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['XYYSCLQD']]);
    /**
     * flow_list_id == LIST_UUID
     * [{\"FS\":\"3\",\"WJMC\":\"\\u6388\\u6743\\u59d4\\u6258\\u4e66\",\"LIST_UUID\":\"C796EE44F2300001F2937C101BF0B9D0\"}]
     * [C796EE44F2300001F2937C101BF0B9D0:{file_name:'xxx',...}]
     */
    console.log(XYYSCLQD);
    let XYYSCLQD_atta;
    try {
        //XYYSCLQD = JSON.parse(XYYSCLQD); 
        XYYSCLQD_atta = await attaRebuild(ctx, XYYSCLQD);
    } catch (error) {
        ctx.logger.debug('老数据', XYYSCLQD);
    }
    let JXZC = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['JXZC']]);
    ctx.logger.debug('JXZC', JXZC);
    console.log(JXZC);
    let JXZC_atta = await attaRebuild(ctx, JXZC);
    console.log("===========XYYSCLQD_atta================");
    console.log(XYYSCLQD_atta);
    console.log("===========XYYSCLQD================");
    console.log(XYYSCLQD);
    console.log(typeof XYYSCLQD);
    let ids = '';
    JXZC.forEach(e => {
         console.log(e);
         console.log(e.ASSET_ID);
         if(ids==''){
            ids =  e.ASSET_ID;
         }else{
            ids =  ids+','+e.ASSET_ID;
         }
         console.log(ids);
        //JXZC_NAME[e.ASSET_ID] = await d_flow.find_assetname_by_assetid(e.ASSET_ID);
    });
    let JXZC_NAME ={}
    if (ids){
      JXZC_NAME = await d_flow.find_assetname_by_assetid(ids);
    }
    return {
        success: temple.render('zcjyzysp.html', {
            json_data: parsedJson,
            project_info: project_info,
            // datas: datas,
            JXZC: JXZC,
            JXZC_atta: JXZC_atta,
            JXZC_NAME:JXZC_NAME,
            XYYSCLQD: XYYSCLQD,
            XYYSCLQD_atta: XYYSCLQD_atta,
            type: typeof XYYSCLQD
        })
    }
}
let syqzrdjqrd = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let pa_info = await d_flow.find_supply_info(affair.affa_id);
    parsedJson.sfbe518f3e9911e6ad2d184f32ca6bca = await d_flow.find_cust_name(parsedJson.sfbe518f3e9911e6ad2d184f32ca6bca);
    parsedJson.ufaa29c03e9911e6aa71184f32ca6bca = await d_flow.find_bank_name_ta(parsedJson.ufaa29c03e9911e6aa71184f32ca6bca);
    let cb = await d_flow.find_cb(parsedJson.f5d7cacf3e9811e6995f184f32ca6bca);
    return {
        success: temple.render('syqzrdjqrd.html', {
            json_data: parsedJson,
            project_info: project_info,
            pa_info:pa_info,
            cb: cb['cb']
        })
    }
}
// 信托资金/销售资金监管使用申请流程
let xtzjxszjjgsysq = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xtzjxszjjgsysq.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 信托业务章/印签使用审批流程
let xtywz = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xtywz.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }

}
// 用印审批流程
let yysplc = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let json_arr = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['APPROVALSELA']]);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let apprpvalsela = await d_flow.find_apprpvalsela(affair.affa_id,regitem_id);
    return {
        success: temple.render('yysplc.html', {
            json_data: parsedJson,
            project_info: project_info,
            apprpvalsela: apprpvalsela
        })
    }
}
// 抵质押权利证书(证明)领用审批
let dzyqlzs = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let qlzs = await d_flow.find_twarrants_transfer_list_info(affair.affa_id);
    return {
        success: temple.render('dzyqlzs.html', {
            json_data: parsedJson,
            project_info: project_info,
            qlzs:qlzs
        })
    }
}

// 权利证书(证明)移交审批
let dzyqlzsyj = async (ctx,affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let trans_info = await d_flow.find_twarrants_transfer_info(affair.affa_id);
    let trans_list_info = await d_flow.find_twarrants_transfer_list_info(affair.affa_id);
    let zsxx = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['ZSXX']]);
    let zsxx_atta;
    zsxx_atta = await attaRebuild(ctx, zsxx);
    return {
        success: temple.render('dzyqlzs_yj.html', {
            trans_info: trans_info,
            trans_list_info: trans_list_info,
            zsxx_atta:zsxx_atta,
            zsxx:zsxx
        })
    }
}

// 营销费用结算流程
let yxfyjshz = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('yxfyjs.html', {
            json_data: parsedJson,
            project_info: project_info,
            affa_id:affair.affa_id,
            regitem_id: regitem_id
        })
    }
}

// 不良资产处置中介选聘审批流程
let blzcczzjxpsp = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);

    let LAWYER = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['LAWYER']]);
    console.log("===========LAWYER================");
    console.log(LAWYER);
    console.log(typeof LAWYER);


    return {
        success: temple.render('blzcczzjxpsp.html', {
            json_data: parsedJson,
            project_info: project_info,
            LAWYER: LAWYER,
            type: typeof LAWYER
        })
    }
}
// 不良资产处置方案签报审批流程
let blzcczfaqbsp = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('blzcczfaqb.html', {
            json_data: parsedJson,
            project_info: project_info,
            affa_id:affair.affa_id,
            regitem_id: regitem_id
        })
    }
}
// 不良资产处置重大事项签报审批流程
let blzcczzdsxqbsp = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('blzcczzdsxqb.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 不良资产处置信息汇报流程
let blzcczxxhb = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('blzcczxxhb.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}

//中后期管理报告流程
let zhqglbg = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('zhqglbg.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}

// 中介机构（律师/审计/评估）聘用审批流程
let zjjgpysp = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);

    let PERSON = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['PERSON']]);
    console.log("===========PERSON================");
    console.log(PERSON);
    console.log(typeof PERSON);

    let bmjbinfo = await d_flow.find_taskinfo(affair.affa_id,'B7BB28BFFD16466684B9AADA17DBC38A');//使用部门经办发起
    let bmfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'CA06B9AF15794DD190B55681E63D40C3');//使用部门负责人
    let hgflfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'E15F061E934E4AC5BACC6D0415A28FF2');//合规法律部负责人
    let fxglfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'D7364649F74D49B6985A15A471351274');//风险管理部负责人
    let xtcwbinfo = await d_flow.find_taskinfo(affair.affa_id,'B3BFFAD5EA4C444E8E0461B721565484');//信托财务部
    let sxfkginfo = await d_flow.find_taskinfo(affair.affa_id,'P35F391FD2434C00853F500B9306580D');//首席风险官
    let ywzgldinfo = await d_flow.find_taskinfo(affair.affa_id,'E3225D4879EA4C83A4F93BF01B6237FA');//业务主管领导
    let zjlinfo = await d_flow.find_taskinfo(affair.affa_id,'R544523121C04D179DFB1008674CB6E4');//总经理（金额5万元及以上）
    let syhbmjbinfo = await d_flow.find_taskinfo(affair.affa_id,'W385D8EC8B964F4DAFB4129283784CCA');//（服务质量评价环节）使用部门经办人员
    let syhbmfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'U1C85060F03A4D7082541E25AE8C827E');//（服务质量评价环节）使用部门经办人员
    let syhhgflfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'O0398A6F2B8D4E918510B21144E10BA6');//合规法律部负责人
    let syhfxglfzrinfo = await d_flow.find_taskinfo(affair.affa_id,'V0114B419D62494DB2F0E04F13212C77');//风险管理部负责人

    return {
        success: temple.render('zjjgpysp.html', {
            json_data: parsedJson,
            project_info: project_info,
            PERSON: PERSON,
            affair:affair,
            type: typeof PERSON,
            bmjbinfo: bmjbinfo,
            bmfzrinfo: bmfzrinfo,
            hgflfzrinfo: hgflfzrinfo,
            fxglfzrinfo: fxglfzrinfo,
            xtcwbinfo: xtcwbinfo,
            sxfkginfo: sxfkginfo,
            zjlinfo: zjlinfo,
            syhbmjbinfo: syhbmjbinfo,
            syhbmfzrinfo: syhbmfzrinfo,
            syhhgflfzrinfo: syhhgflfzrinfo,
            syhfxglfzrinfo: syhfxglfzrinfo,
            ywzgldinfo: ywzgldinfo
        })
    }
}

// 信托项目预审评审意见表决流程
let xmzysps = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let taskinfo = await d_flow.find_taskinfonumber(affair.affa_id,'V7C1F4BB5BBF45CCAB1C03327564FAD5');
    let hqyjinfo = await d_flow.find_task_summer_for_huiq(affair.affa_id,'SAABD0AC8253441D9F83EFCC9138BD08');
    let type = '1';
    if (taskinfo){
        type = '2';
    }
    let hqyj = '';
    if (hqyjinfo){
        hqyj = hqyjinfo.summary;
    }
    return {
        success: temple.render('zysps.html', {
            json_data: parsedJson,
            project_info: project_info,
            affa_id:affair.affa_id,
            regitem_id: regitem_id,
            hqyj: hqyj,
            type:type
        })
    }
}
// 信托项目终审评审意见书
let xmzzsps = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson.rd2683e9101611e9b1c6005056a6a83a;
    let project_info = await d_flow.find_project_info(regitem_id);
    let affair_info = await d_flow.find_affar(affair.affa_id);
    let taskinfo = await d_flow.find_taskinfonumber(affair.affa_id,'PA46775B37B34A8E83C9E24B9E088F01');
    let hqyjinfo = await d_flow.find_task_summer_for_huiq(affair.affa_id,'F6E01ED9C8D14ABC9C3A9798F4830C89');
    let type = '1';
    if (taskinfo){
        type = '2';
    }
    let hqyj = '';
    if (hqyjinfo){
        hqyj = hqyjinfo.summary;
    }
    return {
        success: temple.render('zzsps.html', {
            json_data: parsedJson,
            project_info: project_info,
            affa_id:affair.affa_id,
            regitem_id: regitem_id,
            hqyj:hqyj,
            type:type,
            affair_info:affair_info
        })
    }
}
// 法人签字登记流程
let frqzdj = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);

    let FILE = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['FILE']]);
    console.log("===========FILE================");
    console.log(FILE);
    console.log(typeof FILE);


    return {
        success: temple.render('frqzdjb.html', {
            time: affair.create_time,
            json_data: parsedJson,
            project_info: project_info,
            regitem_id: regitem_id,
            affa_id: affair.affa_id,
            deptname: parsedJson.wb408acf124f11e9843d005056a6a83a,
            FILE: FILE,
            type: typeof FILE
        })
    }
}
// 信托合同交接记录(集合)
let xthtjjjl = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson.rd2683e9101611e9b1c6005056a6a83a;
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xthtjjjl.html', {
            json_data: parsedJson,
            project_info: project_info
        })
    }
}
// 清算报告审批流程
let qsbgbd = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('qsbgbd.html', {
            affair_json: affair_json,
            project_info: project_info
        })
    }

}

// 信息披露审批流程
let xxpllcspb = async (affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    return {
        success: temple.render('xxpllcspb.html', {
            affair_json: affair_json,
            project_info: project_info,
            create_user:affair.create_user,
            create_dept:affair.create_dept
        })
    }

}
// 客户评级及限额审批流程(20190523）
let khpjjxesp = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let info = await d_flow.find_customer_contration_info(affair.affa_id);
    let sqyjinfo = await d_flow.find_taskinfo(affair.affa_id,"s25e8a8f7aa711e9a2b3005056a6a83a");
    let hgyjinfo = await d_flow.find_taskinfo(affair.affa_id,"s25b2f2e7aa711e99872005056a6a83a");
    let fxyjinfo = await d_flow.find_taskinfo(affair.affa_id,"s25da02e7aa711e98d1a005056a6a83a");
    let sqyj = '';
    if(sqyjinfo){
        sqyj = sqyjinfo.summary;
    }
    let hgyj = '';
    if(hgyjinfo){
        hgyj = hgyjinfo.summary;
    }
    let fxyj = '';
    if(fxyjinfo){
        fxyj = fxyjinfo.summary;
    }
    return {
        success: temple.render('khpjjxecsspd.html', {
            info: info,
            sqyj: sqyj,
            hgyj: hgyj,
            fxyj: fxyj
        })
    }
}

// 客户评级及限额审批流程(20190523）
let khjzdbztzspd = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let info = await d_flow.find_customer_contration_info(affair.affa_id);
    let sqyjinfo = await d_flow.find_taskinfo(affair.affa_id,"X754FA31D83948EFB974D563148469E4");
    let hgyjinfo = await d_flow.find_taskinfo(affair.affa_id,"V14B3EB0CF7A49B78F56C3E1F21AB046");
    let fxyjinfo = await d_flow.find_taskinfo(affair.affa_id,"F67A4B1411B0471080E687D17D11F489");
    let zjlyjinfo = await d_flow.find_taskinfo(affair.affa_id,"A6CDE418D5E245C69C3227FE29E943E9");
    let sqyj = '';
    if(sqyjinfo){
        sqyj = sqyjinfo.summary;
    }
    let hgyj = '';
    if(hgyjinfo){
        hgyj = hgyjinfo.summary;
    }
    let fxyj = '';
    if(fxyjinfo){
        fxyj = fxyjinfo.summary;
    }
    let zjlyj = '';
    if(zjlyjinfo){
        zjlyj = zjlyjinfo.summary;
    }
    return {
        success: temple.render('khzjdbztzspd.html', {
            info: info,
            sqyj: sqyj,
            hgyj: hgyj,
            fxyj: fxyj,
            zjlyj: zjlyj
        })
    }
}

// 客户限额及集中度占用备案审批
let khxejjzdzybad = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let info = await d_flow.find_customer_contration_info(affair.affa_id);
    let sqyjinfo = await d_flow.find_taskinfo(affair.affa_id,"f482cb42ba3b11e9b827005056a6a83a");
    let bmfzryjinfo = await d_flow.find_taskinfo(affair.affa_id,"f4805a41ba3b11e9bf2f005056a6a83a");
    let fxyjinfo = await d_flow.find_taskinfo(affair.affa_id,"f482cb41ba3b11e98730005056a6a83a");
    let sqyj = '';
    if(sqyjinfo){
        sqyj = sqyjinfo.summary;
    }
    let bmfzryj = '';
    if(bmfzryjinfo){
        bmfzryj = bmfzryjinfo.summary;
    }
    let fxyj = '';
    if(fxyjinfo){
        fxyj = fxyjinfo.summary;
    }
    return {
        success: temple.render('khxejjzdzybad.html', {
            info: info,
            sqyj: sqyj,
            bmfzryj: bmfzryj,
            fxyj: fxyj
        })
    }
}
//业务档案归档审批
let ywdagdjjlc = async (ctx, affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let archive_info = await d_flow.find_file_archive_info(affair.affa_id);
    let file_archive_list = await d_flow.find_file_archive_list_info(affair.affa_id);
    let gdzl = JSON.parse(parsedJson[flow_regitem[affair.flow_id]['GDZL']]);
    let gdzl_atta;
    gdzl_atta = await attaRebuild(ctx, gdzl);
    return {
        success: temple.render('ywdagdjjd.html', {
            archive_info: archive_info,
            file_archive_list: file_archive_list,
            gdzl_atta:gdzl_atta,
            gdzl:gdzl
        })
    }
}
// 信托受益权转让(集合)
let syqzrjh = async (affair) => {
    // 客户端渲染方式
    let data = await fs.readFile('templates/syqzrjh.html', 'utf-8');
    return {
        success: data
    }
    // let affair_json = JSON.parse(affair.jsondata);
    // return {
        // success: temple.render('syqzrjh.html', {
            // json_data:affair_json
        // })
    // }
}
// 信托收益账户变更(2018-3-14添加该段）
let xtsyzhbg = async (affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let product_info = await d_flow.find_product_info(regitem_id);
    parsedJson.e9875470210a11e88f71005056a687a8 = await d_flow.find_cust_name(parsedJson.e9875470210a11e88f71005056a687a8);
    parsedJson.aced89a1210d11e8b02f005056a687a8 = await d_flow.find_bank_name_ta(parsedJson.aced89a1210d11e8b02f005056a687a8)//原收益账户开户行
    parsedJson.b4847b00210e11e88a64005056a687a8 = await d_flow.find_bank_name_ta(parsedJson.b4847b00210e11e88a64005056a687a8)//新收益账户开户行
    return {
        success: temple.render('xtsyzhbg.html', {
            json_data: parsedJson,
            product_info: product_info
        })
    }
}
let flowRouter = async(ctx, affair) => {
    let res;
    // console.log(affair);
    switch (affair.flow_id) {
        // 合同审批流程 + 合同审批流程(非实质性变更)
        case 'afad680f3ec711e6ae92184f32ca6bca':
        case 'd70e099e240411e7a3af005056a687a8':
            res = await contractApproval(ctx, affair);
            break;
        // 产品发行流程
        case 'b395b7615f9811e6b480b888e3e688de':
            res = await productDistribution(affair);
            break;
        // 产品发行流程(非事务)
        case 'wa456c0f1a1d11e9b1af005056a61cf9':
            res = await cpfxfsw(affair);
            break;
        // 项目签报审批流程
        case 'qba4418052fc11e68f55184f32ca6bca':
            res = await projectReport(affair);
            break;
        // 项目审批流程
        case 'de19f3e165a911e68d9140f02f0658fc':
            res = await projectApproval(affair);
            break;
        // 收款流程 + 付款流程 + 放款审批流程 + 收支计划审批流程 + 工作计划审批流程
        case 'v7608f2e3e8811e688c2184f32ca6bca':
        case 'v11a7d403e8611e6b07e184f32ca6bca':
        case 'fdf2ed804a6411e6905fd85de21f6642':
        case 'rfb70130910911e6a83c184f32ca6bca':
        case 'wb2eee409a6211e687f3415645000030':
            res = await receivables(affair);
            break;
        // 项目签报变更流程
        case 'o53659213e5c11e6a7bd184f32ca6bca':
            res = await sign(affair);
            break;
        // 中后期重大事项签报流程
        case 'rdf83711470311e68bb0184f32ca6bca':
            res = await importantMatter(affair);
            break;
        // 账户开户流程
        case 'eebf606e3e6411e68f15184f32ca6bca':
            res = await accountOpen(affair);
            break;
        // 销户流程
        case 'p0cf06613e8e11e680a2184f32ca6bca':
            res = await accountCancel(affair);
            break;
        // 放款审批流程(证券投资) + 放款审批流程(消费贷及房抵贷)
        case 'v93e92803bb611e787b3000c294af360':
        case 'wfee86703bb611e7ae5d000c294af360':
            res = await payApply(affair);
            break;
        // 信托登记审批流程
        case 'ab6e048f3e6211e68067184f32ca6bca':
            res = await xtdjsp(affair);
            break;
        // 外派人员行使表决权审批流程
        case 'od1bb94f470811e6ac64184f32ca6bca':
            res = await xsbjq(affair);
            break;
        // 外派人员（含董监事）委派审批流程
        case 'x0e79ca1470711e69bce184f32ca6bca':
            res = await expatriateApply(affair);
            break;
        // 资产解押审批流程
        case 'v4b02a4f3e8a11e6ac80184f32ca6bca':
            res = await zcjyzysp(ctx, affair);
            break;
        // 受益权转让审批流程
        case 'ta32efd13e8c11e6ae36184f32ca6bca':
            res = await syqzrdjqrd(affair);
            break;
        // 信托资金/销售资金监管使用申请流程
        case 'pfb34fc0471111e6a77b184f32ca6bca':
            res = await xtzjxszjjgsysq(affair);
            break;
        // 信托业务章/印签使用审批流程
        case 's8555e40476611e7a73d000c294af360':
            res = await xtywz(affair);
            break;
        // 用印审批流程
        case 'b5792af0470e11e68438184f32ca6bca':
            res = await yysplc(affair);
            break;
        // 抵质押权利证书(证明)领用审批
        case 'xca765cf519611e79e8d005056a687a8':
            res = await dzyqlzs(affair);
            break;
        // 抵质押权利证书(证明)移交审批
        case 'q28638b01a2311e998fd005056a61cf9':
            res = await dzyqlzsyj(ctx,affair);
            break;
        // 营销费用结算
        case 'v26e5061032b11e9bf71005056a61cf9':
            res = await yxfyjshz(affair);
            break;
        // 不良资产处置中介选聘审批流程
        case 'cae5cd5e01e411e9ab26005056a61cf9':
            res = await blzcczzjxpsp(ctx, affair);
            break;
        // 不良资产处置方案签报审批流程 
        case 'dd924830ff7811e88cd9005056a61cf9':
            res = await blzcczfaqbsp(affair);
            break;
        // 不良资产处置重大事项签报审批流程
        case 'e31972c001f211e9b102005056a61cf9':
            res = await blzcczzdsxqbsp(affair);
            break;
        // 不良资产处置信息汇报流程
        case 'oa3982e101f411e9a455005056a61cf9':
            res = await blzcczxxhb(affair);
            break;
        // 中后期管理报告流程
        case 't3075f5e657211e982fc005056a61cf9':
            res = await zhqglbg(affair);
            break;
        // 中介机构（律师/审计/评估）聘用审批流程
        case 's829d3618dd211e9ada9005056a61cf9':
            res = await zjjgpysp(ctx, affair);
            break;
        // 信托项目预审评审意见表决流程
        case 'q1bd287010c411e989cd005056a61cf9':
            res = await xmzysps(affair);
            break;
        // 信托项目终审评审意见书
        case 'qf979b0f10c411e98c20005056a61cf9':
            res = await xmzzsps(affair);
            break;
        // 法人签字登记流程
        case 'daf2bbc01a1f11e9a719005056a61cf9':
            res = await frqzdj(affair);
            break;
        // 信托合同交接记录(集合)
        case 'c722681e519411e78b64005056a687a8':
            res = await xthtjjjl(affair);
            break;
        // 信托受益权转让(集合)
        case 'sae22ba150d211e79ce6005056a687a8':
            res = await syqzrjh(affair);
            break;
        // 清算报告审批流程
        case 'f92d6e211fe711e7bca7005056a687a8':
            res = await qsbgbd(affair);
            break;
        // 信息披露审批流程
        case 't4cd0f403e8b11e6ad89184f32ca6bca':
            res = await xxpllcspb(affair);
            break;
        // 信托收益账户变更流程(2018-3-14添加该段）
        case 'uf14d630211011e898a0005056a687a8':
            res = await xtsyzhbg(affair);
            break;
        // 业务档案归档交接流程
        case 'c1cf5f0f8be711e98947005056a6a83a':
            res = await ywdagdjjlc(ctx, affair);
            break;
        // 客户评级及限额审批流程（20190523）
        case 's25933617aa711e99d9e005056a6a83a':
            res = await khpjjxesp(affair);
            break;
        // 客户集中度标准调整审批单
        case 'oc987c8f7dea11e9bcc3005056a6a83a':
            res = await khjzdbztzspd(affair);
            break;
        // 客户限额及集中度占用备案审批
        case 'f4805a40ba3b11e9af01005056a6a83a':
            res = await khxejjzdzybad(affair);
            break;
        // 房屋抵押贷款用印申请流程
        //case 'd30aa0dea29711e79897000c294af360':
            //res = await fwdydkyysplc(affair);
            //break;
        default:
            res = {fail: '非指定流程'};
            break;
    }
    return res;
}
// 流程展示
module.exports = function (router) {
    router.get('/flow_show_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        let affair = await d_flow.find_affar_by_taskid(task_id);
        ctx.response.body = await flowRouter(ctx, affair);
    });
    router.get('/flow_show_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let affair = await d_flow.find_affar(affa_id);
        ctx.response.body = await flowRouter(ctx, affair);
    });
    // 通过字典id找字典名称 涉及流程: 贷款投资合同录入流程
    router.get('/getDictName/:dict_id', async (ctx, next) => {
        let dict_id = ctx.params.dict_id;
        ctx.response.body = await d_dict.find_guarantor_dict(dict_id, next);
    });
    // 担保合同编号
    router.get('/getContractId/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let contract_ids = await d_dict.get_contract_id(regitem_id, next);
        ctx.response.body = contract_ids.join(',');
    });
    // 获取流程实例信息
    router.get('/affa_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        ctx.response.body = await d_flow.find_affar_by_taskid(task_id);
    });
    router.get('/affa_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.find_affar(affa_id);
    });
    // 获取项目id
    router.get('/regitemid_taskid/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        ctx.response.body = await d_flow.find_regitem_id_by_taskid(task_id);
    });
    router.get('/regitemid_affaid/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.find_regitem_id_by_affaid(affa_id);
    });
    // 获取关联流程数量
    router.get('/find_affanumber_by_taskid/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        let number = await d_flow.find_affanumber_by_taskid(task_id);
        ctx.response.body = number;
    });
    // 获取关联流程数量
    router.get('/find_affanumber_by_affaid/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.find_affanumber_by_affaid(affa_id);
    });
    router.get('/find_project_info_by_regitemid/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.find_project_info(regitem_id);
        ctx.response.body = product_info
    });

    //查询预登记-产品信息要素
    router.get('/find_app_dfs_zxd_ydjcpxx_by_regitem_id/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.find_app_dfs_zxd_ydjcpxx_by_regitem_id(regitem_id);
        ctx.response.body = product_info
    });

    //查询预登记-异地推介补充要素
    router.get('/find_app_dfs_zxd_ydjtjd_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_ydjtjd_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //保存预登记-产品信息要素
    router.post('/insert_app_dfs_zxd_ydjcpxx', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_ydjcpxx(data);
        ctx.response.body = product_info
    });

    //保存预登记-异地推介补充要素
    router.post('/insert_app_dfs_zxd_ydjtjd', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_ydjtjd(data);
        ctx.response.body = product_info
    });

    //查询初始登记-产品信息要素
    router.get('/find_app_dfs_zxd_cscpxx_by_regitem_id/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.find_app_dfs_zxd_cscpxx_by_regitem_id(regitem_id);
        ctx.response.body = product_info
    });

    //查询预登记-交易对手要素
    router.get('/find_app_dfs_zxd_csjyds_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_csjyds_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //查询预登记-受益权结构要素集合
    router.get('/find_app_dfs_zxd_cssyq_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_cssyq_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //查询预登记-信托合同要素集合
    router.get('/find_app_dfs_zxd_csxtht_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_csxtht_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //查询预登记-银行资金账户要素集合
    router.get('/find_app_dfs_zxd_yhzjzh_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_yhzjzh_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //查询预登记-证券类账户要素集合
    router.get('/find_app_dfs_zxd_cszqzh_by_uuid/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.find_app_dfs_zxd_cszqzh_by_uuid(uuid);
        ctx.response.body = product_info
    });

    //保存初始登记-产品信息要素
    router.post('/insert_app_dfs_zxd_cscpxx', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_cscpxx(data);
        ctx.response.body = product_info
    });

    //保存预登记-交易对手要素
    router.post('/insert_app_dfs_zxd_csjyds', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_csjyds(data);
        ctx.response.body = product_info
    });

    //保存预登记-受益权结构要素集合
    router.post('/insert_app_dfs_zxd_cssyq', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_cssyq(data);
        ctx.response.body = product_info
    });

    //保存预登记-信托合同要素集合
    router.post('/insert_app_dfs_zxd_csxtht', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_csxtht(data);
        ctx.response.body = product_info
    });

    //保存预登记-银行资金账户要素集合
    router.post('/insert_app_dfs_zxd_yhzjzh', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_yhzjzh(data);
        ctx.response.body = product_info
    });

    //保存预登记-证券类账户要素集合
    router.post('/insert_app_dfs_zxd_cszqzh', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_cszqzh(data);
        ctx.response.body = product_info
    });

    //查询终止登记-产品信息要素
    router.get('/find_app_dfs_zxd_zzcpxx_by_regitem_id/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.find_app_dfs_zxd_zzcpxx_by_regitem_id(regitem_id);
        ctx.response.body = product_info
    });

    //保存终止登记-产品信息要素
    router.post('/insert_app_dfs_zxd_zzcpxx', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_zzcpxx(data);
        ctx.response.body = product_info
    });

    //查询事前报告-产品信息要素
    router.get('/find_app_dfs_zxd_sqcpxx_regitem_id/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.find_app_dfs_zxd_sqcpxx_regitem_id(regitem_id);
        ctx.response.body = product_info
    });

    //保存事前报告-产品信息要素
    router.post('/insert_app_dfs_zxd_sqcpxx', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.insert_app_dfs_zxd_sqcpxx(data);
        ctx.response.body = product_info
    });

    //查询预登记-产品信息要素-详情
    router.get('/query_app_dfs_zxd_ydjcpxx/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.query_app_dfs_zxd_ydjcpxx(regitem_id);
        ctx.response.body = product_info
    });

    //查询预登记-异地推介补充要素-详情
    router.get('/query_app_dfs_zxd_ydjtjd/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_ydjtjd(uuid);
        ctx.response.body = product_info
    });

    //查询终止登记-产品信息-详情
    router.get('/query_app_dfs_zxd_zzcpxx/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.query_app_dfs_zxd_zzcpxx(regitem_id);
        ctx.response.body = product_info
    });

    //查询事前登记-产品信息-详情
    router.get('/query_app_dfs_zxd_sqcpxx/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.query_app_dfs_zxd_sqcpxx(regitem_id);
        ctx.response.body = product_info
    });

    //查询初始登记-产品信息要素-详情
    router.get('/query_app_dfs_zxd_cscpxx/:regitem_id', async (ctx, next) => {
        let regitem_id = ctx.params.regitem_id;
        let product_info = await d_flow.query_app_dfs_zxd_cscpxx(regitem_id);
        ctx.response.body = product_info
    });

    //查询初始登记-初始交易对手-详情
    router.get('/query_app_dfs_zxd_csjyds/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_csjyds(uuid);
        ctx.response.body = product_info
    });

    //查询初始登记-初始受益权结构-详情
    router.get('/query_app_dfs_zxd_cssyq/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_cssyq(uuid);
        ctx.response.body = product_info
    });

    //查询初始登记-初始信托合同-详情
    router.get('/query_app_dfs_zxd_csxtht/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_csxtht(uuid);
        ctx.response.body = product_info
    });

    //查询初始登记-初始银行资金账户-详情
    router.get('/query_app_dfs_zxd_yhzjzh/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_yhzjzh(uuid);
        ctx.response.body = product_info
    });

    //查询初始登记-初始证券类账户-详情
    router.get('/query_app_dfs_zxd_cszqzh/:uuid', async (ctx, next) => {
        let uuid = ctx.params.uuid;
        let product_info = await d_flow.query_app_dfs_zxd_cszqzh(uuid);
        ctx.response.body = product_info
    });

    //查询数据字典
    router.post('/query_app_dfs_scode_content', async (ctx, next) => {
        let data = ctx.request.body;
        let product_info = await d_flow.query_app_dfs_scode_content(data);
        ctx.response.body = product_info
    });
}