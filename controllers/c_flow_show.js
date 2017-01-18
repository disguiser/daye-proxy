'use strict';
const temple = require('../utils/temple.js');
const d_flow = require('../dao/d_flow.js');
const d_attachment = require('../dao/d_attachment.js');
const dict_file_type = require('../models/dict_file_type');
const dict_yes_or_no = require('../models/dict_yes_or_no');
// 流程展示
module.exports = function (router) {
    router.get('/get_table/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let affair = await d_flow.find_affar(affa_id, next);
        // console.log(affair);
        var res;
        // 合同审批流程
        if(affair.flow_id == 'afad680f3ec711e6ae92184f32ca6bca'){
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
        // 产品发行流程
        } else if(affair.flow_id == 'b395b7615f9811e6b480b888e3e688de'){
            let json_data = await d_flow.find_tasks(affa_id, next);
            // console.log(json_data);
            console.log(json_data.T16D12D1A5D3406D9CC65A76AD7691B1.qc2f64ae5f9811e690e4b888e3e688de);
            res = {
                success: temple.render('fx_table.html' ,{
                    json_data: json_data,
                    dict_yes_or_no: dict_yes_or_no
                })
            };
        } else {
            res = {fail: '非指定流程'};
        }
        ctx.response.body = res;
    });
}