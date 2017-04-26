'use strict';
const temple = require('../utils/temple.js');
const d_flow = require('../dao/d_flow.js');
const d_attachment = require('../dao/d_attachment.js');
const dict_file_type = require('../dicts/dict_file_type');
const dict_yes_or_no = require('../dicts/dict_yes_or_no');
const dict_bank_type = require('../dicts/dict_bank_type');
const d_dict = require('../dao/d_dict.js');

let contractApproval = async (affair) => {
    // 合同审批流程
    let res;
    let json_data = affair.jsondata;
    if(json_data!=''){
        json_data = JSON.parse(json_data);
        // console.log(json_data.x7857b1e3ebc11e68228184f32ca6bca);
        // 信托文件
        let intrust_attachments = JSON.parse(json_data.x7857b1e3ebc11e68228184f32ca6bca);
        let flow_list_ids = [];
        intrust_attachments.forEach(function(element) {
            // console.log(element.LIST_UUID);
            flow_list_ids.push(element.LIST_UUID);
        });
        let attachments = await d_attachment.find_by_flis(flow_list_ids);
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
    // console.log(json_data.R29FFCA438734A42AE6409144A1D78A3.qc2f64ae5f9811e690e4b888e3e688de);
    // console.log(affair.jsondata);
    let product_id = JSON.parse(affair.jsondata)['a81a38d15f9711e6aaebb888e3e688de'];
    let project_info = await d_flow.find_project_info_by_product_id(product_id);
    let json_data = await d_flow.find_tasks(affair.affa_id, "'R29FFCA438734A42AE6409144A1D78A3','PBB558EE7E914339B01828AC11437874','D6887042FAD54274857C6A48018A820F'");
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
    console.log(JSON.parse(json_data));
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
// 项目签报审批流程 与 项目立项审批流程(合并)
let projectReport = async(affair) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id);
    return {
        success: '项目编号为: ' + project_info['REGITEM_CODE']
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
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printPayNotice?pay_uuid=${json_data.c7d2586153c611e6858ab888e335e00a}&node_id=${node_id}"></iframe>`
        }
    } else if(affair.flow_id=='fdf2ed804a6411e6905fd85de21f6642'){ // 放款审批流程
        return {
            success: `<iframe id="noticeIframe" scrolling="no" name="noticeIframe" width="100%" frameborder="0" height="800px" src="/x/intrustqlc/views/dy/printOutNotice?loan_uuid=${json_data.q6d38600020811e7b242415645000030}&node_id=${node_id}"></iframe>`
        }
    } else if (affair.flow_id == 'rfb70130910911e6a83c184f32ca6bca') {
        return {
            success: `<a id="theA" href="/x/intrustqlc/views/dy/inPayPlan?affa_id=${affair.affa_id}" >查看收支计划</a>`
        }
    } else if (affair.flow_id == 'wb2eee409a6211e687f3415645000030') {
        return {
            success: `<a id="theA" href="/x/intrustqlc/views/dy/taskPlan?affa_id=${affair.affa_id}" >查看工作计划</a>`
        }
    }
}
let accountOpen = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    // let task_jsons = await d_flow.find_tasks(affair, "'O91D097B848A4CFD934EB2A1848D5D04','UEBA868CD26E4027A05B3D6CB91B4201'");
    return {
        success: temple.render('account_open.html', {
            project_info: project_info,
            product_info: product_info,
            affair_json: affair_json,
            dict_yes_or_no: dict_yes_or_no,
            dict_bank_type: dict_bank_type
        })
    };
}
let accountCancel = async(affair) => {
    let affair_json = JSON.parse(affair.jsondata);
    let regitem_id = affair_json[flow_regitem[affair.flow_id]['regitem_id']];
    let project_info = await d_flow.find_project_info(regitem_id);
    let product_info = await d_flow.find_product_info(regitem_id);
    return {
        success: temple.render('account_cancel.html', {
            project_info: project_info,
            product_info: product_info,
            affair_json: affair_json
        })
    };
}
let flowRouter = async(affair) => {
    let res;
    // console.log(affair);
    if (affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca') { // 合同审批流程
        res = await contractApproval(affair);
    } else if (affair.flow_id == 'b395b7615f9811e6b480b888e3e688de') { // 产品发行流程
        res = await productDistribution(affair);
    } else if (affair.flow_id == 'qba4418052fc11e68f55184f32ca6bca' || affair.flow_id == 'de19f3e165a911e68d9140f02f0658fc') { // 项目签报审批流程 项目立项审批流程(合并)
        res = await projectReport(affair);
    } else if (affair.flow_id == 'v7608f2e3e8811e688c2184f32ca6bca' || affair.flow_id == 'v11a7d403e8611e6b07e184f32ca6bca' || affair.flow_id=='fdf2ed804a6411e6905fd85de21f6642' || affair.flow_id=='rfb70130910911e6a83c184f32ca6bca' || affair.flow_id=='wb2eee409a6211e687f3415645000030') { // 收款流程 + 付款流程 + 放款审批流程 + 收支计划审批流程 + 工作计划审批流程
        res = await receivables(affair);
    } else if (affair.flow_id == 'o53659213e5c11e6a7bd184f32ca6bca' || affair.flow_id == 'rdf83711470311e68bb0184f32ca6bca') { // 项目签报变更流程 + 中后期变更签报流程
        res = await signChange(affair);
    } else if (affair.flow_id == 'eebf606e3e6411e68f15184f32ca6bca') { // 账户开户流程
        res = await accountOpen(affair);
    } else if (affair.flow_id == 'p0cf06613e8e11e680a2184f32ca6bca') { // 销户流程
        res = await accountCancel(affair); 
    } else {
        res = {fail: '非指定流程'};
    }
    return res;
}
// 流程展示
module.exports = function (router) {
    // 合同审批流程 + 产品发行流程 + 项目签报审批流程 + 收款流程
    router.get('/flow_show_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        let affair = await d_flow.find_affar_by_taskid(task_id);
        ctx.response.body = await flowRouter(affair);
    });
    // 合同审批流程 + 产品发行流程 + 项目签报审批流程 + 收款流程
    router.get('/flow_show_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let affair = await d_flow.find_affar(affa_id);
        ctx.response.body = await flowRouter(affair);
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
    // 获取流程id
    router.get('/flowid_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        ctx.response.body = await d_flow.flowid_task(task_id);
    });
    router.get('/flowid_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        ctx.response.body = await d_flow.flowid_affa(affa_id);
    });
}