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

let contractApproval = async (ctx, affair) => {
    // 合同审批流程
    let res;
    let json_data = affair.jsondata;
    if(json_data!=''){
        json_data = JSON.parse(json_data);
        // 信托文件
        let intrust_attachments;
        if (affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca') {
            intrust_attachments = JSON.parse(json_data.x7857b1e3ebc11e68228184f32ca6bca);
        } else if (affair.flow_id == 'd70e099e240411e7a3af005056a687a8') {
            intrust_attachments = JSON.parse(json_data.w7824b2650e711e79fa3000c294af360);
        }
        let flow_list_ids = [];
        intrust_attachments.forEach(function(element) {
            // console.log(element.LIST_UUID);
            flow_list_ids.push(element.LIST_UUID);
        });
        let attachments = await d_attachment.find_by_flis(flow_list_ids);
        // 去除冗余
        let _attachments = await d_attachment.find_by_ti(attachments[0].temp_id);
        if (ctx.logger.debug()) {
            ctx.logger.debug(JSON.stringify(attachments));
            ctx.logger.debug(JSON.stringify(_attachments));
        }
        if (_attachments.length > attachments.length) {
            let ids = [],
                file_paths;
            _attachments.forEach(function(ele, i){
                if (flow_list_ids.indexOf(ele.flow_list_id) < 0) {
                    ids.push(ele.ID);
                    fs.unlink(ele.file_path);
                }
            });
            await d_attachment.delete_by_ids(ctx, ids);
        }
        // console.log(attachments);
        // 根据flow_id分组
        let attach_rebuild = {};
        attachments.forEach(function(element){
            if( attach_rebuild[element.flow_list_id] == undefined){
                attach_rebuild[element.flow_list_id] = new Array();
                attach_rebuild[element.flow_list_id].push(element);
            }else{
                attach_rebuild[element.flow_list_id].push(element);
            }
        });
        // console.log(JSON.stringify(intrust_attachments));
        // console.log(JSON.stringify(attach_rebuild));
        res = {
            success: temple.render('atta_table.html' ,{
                intrust_attachments: intrust_attachments,
                attachments: attach_rebuild,
                dict_file_type: dict_file_type,
                temp_id: attachments[0] === undefined ? '' : attachments[0].temp_id
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
    // console.log(json_data.T16D12D1A5D3406D9CC65A76AD7691B1.qc2f64ae5f9811e690e4b888e3e688de);
    // console.log(affair.jsondata);
    let regitem_id = JSON.parse(affair.jsondata)['dbc8550ff27a11e6b67a1c3e84e5807c'];
    let project_info = await d_flow.find_project_info(regitem_id);
    let json_data = await d_flow.find_tasks(affair.affa_id, "'T16D12D1A5D3406D9CC65A76AD7691B1','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F'");
    return {
        success: temple.render('fx_table.html', {
            project_info: project_info,
            json_data: json_data,
            dict_yes_or_no: dict_yes_or_no
        })
    };
}
let flow_regitem = {
    rdf83711470311e68bb0184f32ca6bca: {
        regitem_id: 'wb14720059e311e6adbef0def1c335c3',
        json_data: 's085a85e4f0911e69112184f32ca6bca'
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
    }
}
// 项目签报变更流程 + 中后期变更签报流程
let signChange = async(affair) => {
    let parsedJson = JSON.parse(affair.jsondata);
    let regitem_id = parsedJson[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let json_data = parsedJson[flow_regitem[affair.flow_id]['json_data']];
    // console.log(JSON.parse(json_data));
    return {
        success: {
            flow_id: affair.flow_id,
            html: temple.render('change_table.html', {
                project_info: project_info,
                json_data: JSON.parse(json_data),
                risk_assessment: parsedJson['v9d0af4070e511e6935b184f32ca6bca']
            })
        }
    }
}
let sign = async (affair) => {
    return {
        success: temple.render('zs_chang_apply.html', {

        })
    }
}
// 项目签报审批流程
let projectReport = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    project_info.APPLY_DATE = moment(project_info.APPLY_DATE.toString()).format('YYYY年MM月DD日');
    return {
        success: temple.render('project_sign.html', {
            project_info: project_info
        })
    };
}
// 项目审批流程
let projectApproval = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    project_info.APPLY_DATE = moment(project_info.APPLY_DATE.toString()).format('YYYY年MM月DD日');
    return {
        success: temple.render('project_declare.html', {
            project_info: project_info
        })
    };
}
// 收款流程 + 付款流程
let receivables = async(affair) => {
    console.log(affair.jsondata);
    let json_data = JSON.parse(affair.jsondata);
    let node_id = affair.node_id ? affair.node_id : '';
    if (affair.flow_id=='v7608f2e3e8811e688c2184f32ca6bca') { // 收款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printInNotice?in_uuid=${json_data.u948ea80f5b911e68893415645000030}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id=='v11a7d403e8611e6b07e184f32ca6bca'){ // 付款
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printPayNotice?pay_uuid=${json_data.c7d2586153c611e6858ab888e335e00a}&affaid=${affair.affa_id}&node_id=${node_id}"></iframe>`
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
    affair_json['w83e270fcccf11e6a211005056a687a8'] = tools.splitBankNo(affair_json['w83e270fcccf11e6a211005056a687a8']) //格式化
    account_info['ACCT_BANK_ACCT'] = tools.splitBankNo(account_info['ACCT_BANK_ACCT'])             // 银行账号格式化
    return {
        success: temple.render('account_cancel.html', {
            project_info: project_info,
            product_info: product_info,
            account_info: account_info,
            today:moment().format('YYYY-MM-DD'),
            affair_json: affair_json
        })
    };
}
let payApply = async (affair) => {
    let pa_info = await d_flow.find_pay_apply(affair.affa_id);
    let link = affair.flow_id == 'wfee86703bb611e7ae5d000c294af360' ? true : false; 
    return {
        success: temple.render('pay_apply.html', {
            pa_info: pa_info,
            link: link
        })
    }
}
let flowRouter = async(ctx, affair) => {
    let res;
    // console.log(affair);
    if (affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca' || affair.flow_id == 'd70e099e240411e7a3af005056a687a8') { // 合同审批流程 + 合同审批流程(非实质性变更)
        res = await contractApproval(ctx, affair);
    } else if (affair.flow_id == 'b395b7615f9811e6b480b888e3e688de') { // 产品发行流程
        res = await productDistribution(affair);
    } else if (affair.flow_id == 'qba4418052fc11e68f55184f32ca6bca') { // 项目签报审批流程
        res = await projectReport(affair);
    } else if (affair.flow_id == 'de19f3e165a911e68d9140f02f0658fc') { // 项目审批流程
        res = await projectApproval(affair);
    } else if (affair.flow_id == 'v7608f2e3e8811e688c2184f32ca6bca' || affair.flow_id == 'v11a7d403e8611e6b07e184f32ca6bca' || affair.flow_id=='fdf2ed804a6411e6905fd85de21f6642' || affair.flow_id=='rfb70130910911e6a83c184f32ca6bca' || affair.flow_id=='wb2eee409a6211e687f3415645000030') { // 收款流程 + 付款流程 + 放款审批流程 + 收支计划审批流程 + 工作计划审批流程
        res = await receivables(affair);
    } else if (affair.flow_id == 'o53659213e5c11e6a7bd184f32ca6bca' || affair.flow_id == 'rdf83711470311e68bb0184f32ca6bca') { // 项目签报变更流程 + 中后期变更签报流程
        // res = await signChange(affair);
        res = await sign(affair);
    } else if (affair.flow_id == 'eebf606e3e6411e68f15184f32ca6bca') { // 账户开户流程
        res = await accountOpen(affair);
    } else if (affair.flow_id == 'p0cf06613e8e11e680a2184f32ca6bca') { // 销户流程
        res = await accountCancel(affair);
    } else if (affair.flow_id == 'v93e92803bb611e787b3000c294af360' || affair.flow_id == 'wfee86703bb611e7ae5d000c294af360') { //放款审批流程(证券投资) + 放款审批流程(消费贷及房抵贷)
        res = await payApply(affair);
    } else if (affair.flow_id == 'b20e08f0476611e794d9000c294af360') { // 信息披露(季度管理报告)审批流程
        res = {
            success: `<a href="/node/word/${affair.affa_id}">导出word</a>`
        };
    } else {
        res = {fail: '非指定流程'};
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
}