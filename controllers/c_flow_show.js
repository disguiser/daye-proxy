'use strict';
const temple = require('../utils/temple.js');
const d_flow = require('../dao/d_flow.js');
const d_attachment = require('../dao/d_attachment.js');
const dict_file_type = require('../models/dict_file_type');
const dict_yes_or_no = require('../models/dict_yes_or_no');

let contractApproval = async (affair, next) => {
    // 合同审批流程
    let res;
    let json_data = affair.json_data;
    if(json_data!=''){
        json_data = JSON.parse(json_data);
        console.log(json_data.x7857b1e3ebc11e68228184f32ca6bca);
        // 信托文件
        let intrust_attachments = JSON.parse(json_data.x7857b1e3ebc11e68228184f32ca6bca);
        let flow_list_ids = [];
        intrust_attachments.forEach(function(element) {
            // console.log(element.LIST_UUID);
            flow_list_ids.push(element.LIST_UUID);
        });
        let attachments = await d_attachment.find_by_flis(flow_list_ids, next);
        // console.log(attachments);
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
                dict_file_type: dict_file_type
            })
        };
    } else {
        res = {fail: '未找到对应jsondata'};
    }
    return res;
}
// 产品发行流程
let productDistribution  = async(affair, next) => {
    // 产品ID
    // console.log(json_data.R29FFCA438734A42AE6409144A1D78A3.qc2f64ae5f9811e690e4b888e3e688de);
    // console.log(affair.json_data);
    let product_id = JSON.parse(affair.json_data)['a81a38d15f9711e6aaebb888e3e688de'];
    let project_info = await d_flow.find_project_info_by_product_id(product_id, next);
    return {
        success: temple.render('fx_table.html' ,{
            project_info: project_info,
            json_data: affair.json_data,
            dict_yes_or_no: dict_yes_or_no
        })
    };
}
// 项目签报审批流程 与 项目立项审批流程(合并)
let projectReport  = async(affair, next) => {
    let project_info = await d_flow.find_project_info_by_problem_id(affair.affa_id, next);;
    return {
        success: '项目编号为: ' + project_info['REGITEM_NO']
    };
}
// 流程展示
module.exports = function (router) {
    // 合同审批流程 + 产品发行流程 + 项目签报审批流程
    router.get('/flow_show_task/:task_id', async (ctx, next) => {
        let task_id = ctx.params.task_id;
        let affair = await d_flow.find_affar_by_taskid(task_id, next);
        console.log(affair);
        if (affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca') { // 合同审批流程
            ctx.response.body == await contractApproval(affair, next);
        } else if (affair.flow_id == 'b395b7615f9811e6b480b888e3e688de') { // 产品发行流程
            ctx.response.body = await productDistribution(affair, next);
        } else if (affair.flow_id == 'qba4418052fc11e68f55184f32ca6bca' || affair.flow_id == 'de19f3e165a911e68d9140f02f0658fc') { // 项目签报审批流程 项目立项审批流程(合并)
            ctx.response.body = await projectReport(affair, next);
        } else {
            ctx.response.body = {fail: '非指定流程'};
        }
    });
    // 合同审批流程 + 产品发行流程
    router.get('/flow_show_affa/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let affair = await d_flow.find_affar(affa_id, next);
        if (affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca') { // 合同审批流程
            ctx.response.body = await contractApproval(affair, next);
        } else if (affair.flow_id == 'b395b7615f9811e6b480b888e3e688de') { // 产品发行流程
            ctx.response.body = await productDistribution(affair, next);
        } else if (affair.flow_id == 'qba4418052fc11e68f55184f32ca6bca' || affair.flow_id == 'de19f3e165a911e68d9140f02f0658fc') { // 项目签报审批流程 项目立项审批流程(合并)
            ctx.response.body = await projectReport(affair, next);
        } else {
            ctx.response.body = {fail: '非指定流程'};
        }
    });
}