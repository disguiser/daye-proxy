'use strict';
const parse = require('async-busboy');
const disk_path = require('../config').fileupload.path;
const pipeSync = require('../utils/tools').pipeSync;
const XLSX = require('xlsx');
const d_excel = require('../dao/d_excel');
const dict_excel_temp_col = require('../dicts/dict_excel_temp_col');

module.exports = function (router) {
    router.post('/excel/excelImport', async (ctx, next) => {
        const {files, fields} = await parse(ctx.req);
        let flow_id = fields['flow_id'],
            user_name = fields['user_name'],
            project_no = fields['project_no'];
        console.log('==========');
        console.log(project_no);
        if (flow_id != undefined && user_name != undefined && project_no != undefined) {
            for (let file of files) {
                let file_path = disk_path + Date.now() + file.filename;
                console.log(file_path);
                let stat = await pipeSync(file, file_path);
                let workbook = XLSX.readFile(file_path);
                let sheetNames = workbook.SheetNames;

                let workSheet = workbook.Sheets[sheetNames[0]];
                // 数据表格列设置
                let json = [],
                    flag = '2',
                    jsonOb = {};
                for (let e in workSheet) {
                    // 除去特殊参数以及第一行
                    if (!e.startsWith('!') && !/^[A-Z]{1,}1$/.test(e)) {
                        if (e.match(/[0-9]{1,}/)[0] === flag) {
                            jsonOb[dict_excel_temp_col[e.replace(/[0-9]{1,}/, '1')]] = workSheet[e].v;
                        } else {
                            flag = e.match(/[0-9]{1,}/)[0];
                            json.push(jsonOb);
                            jsonOb = {};
                            jsonOb[dict_excel_temp_col[e.replace(/[0-9]{1,}/, '1')]] = workSheet[e].v;
                        }
                    }
                }
                json.push(jsonOb);

                // let json = XLSX.utils.sheet_to_json(workSheet);
                
                await d_excel.excelImport(flow_id, user_name, project_no, json);

                ctx.response.body = {result: 'succeed'};
                ctx.response.type = 'application/json';
            }
        } else {
            ctx.response.body = {result: 'failed',message:'缺少流程编号'};
            ctx.response.type = 'application/json';
        }
    });
    router.get('/excel/gridColumns', async (ctx, next) => {
        let flow_id = ctx.query.flow_id;
        if (flow_id != undefined) {
            let gridColumns = await d_excel.gridColumns(flow_id);
            ctx.response.body = {
                result: 'succeed',
                data: gridColumns
            };
        } else {
            ctx.response.body = {result: 'failed',message:'缺少流程编号'};
        }
        ctx.response.type = 'application/json';
    });
    router.get('/excel/loadAll_affaid', async (ctx, next) => {
        // 插件的自动加载只支持json格式的字符串,不支持json
        let affa_id = ctx.query.affa_id;
        if (affa_id !== undefined) {
            let datas = await d_excel.loadAll_affaid(affa_id);
            ctx.response.body = {
                result: 'succeed',
                data: datas
            };
        } else {
            ctx.response.body = {result: 'failed',message:'缺少流程实例编号'};
        }
        ctx.response.type = 'application/json';
    });
    router.get('/excel/loadAll_flowid', async (ctx, next) => {
        let flow_id = ctx.query.flow_id,
            user_name = ctx.query.user_name,
            project_no = ctx.query.project_no;
        // console.log(project_no);
        if (flow_id !== undefined && user_name != undefined) {
            let datas = await d_excel.loadAll_flowid(flow_id, user_name, project_no);
            ctx.response.body = {
                result: 'succeed',
                data: datas
            };
        } else {
            ctx.response.body = {result: 'failed',message:'缺少流程编号及用户编号'};
        }
        ctx.response.type = 'application/json';
    });
    router.get('/excel/remove', async (ctx, next) => {
        let ids = ctx.query.ids;
        if (ids !== undefined) {
            await d_excel.remove(ids.split(','));
            ctx.response.body = {result: 'succeed'};
        } else {
            ctx.response.body = {result: 'failed',message:'缺少流程编号'};
        }
        ctx.response.type = 'application/json';
    });
}