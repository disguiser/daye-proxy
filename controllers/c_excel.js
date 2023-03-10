'use strict';
const parse = require('async-busboy');
const config = require('../config');
const pipeSync = require('../utils/tools').pipeSync;
const XLSX = require('xlsx');
const d_excel = require('../dao/d_excel');
const dict_excel_temp_col = require('../dicts/dict_excel_temp_col');
const tools = require('../utils/tools');

module.exports = function (router) {
    router.get('/test', async (ctx, next) => {
        let sql = ctx.query.sql;
        console.log(sql);
        // ctx.session.user_code = ctx.cookies.get('webpy_session_id');
        // console.log(ctx.session);
        ctx.response.body = '入库成功';
    });
    router.post('/excel/excelImport', async (ctx, next) => {
        const {files, fields} = await parse(ctx.req);
        let flow_id = fields['flow_id'],
            regitem_id = fields['regitem_id'],
			temp_state = 0,
            affa_id = fields['affa_id'];
        if (!tools.includeEmpty([flow_id, affa_id]) || !tools.includeEmpty([flow_id, regitem_id])){
            for (let file of files) {
                let file_path = config.fileupload.path + Date.now() + file.filename;
                //let file_path = "C:/env/node/fileupload/1508149726493盛业万家2号第29批.xlsx";
                //let file_path = "C:/env/node/fileupload/"+ Date.now() + file.filename;
                console.log('============file_path==============');
                console.log(file_path);
                console.log(file);
                //let stat = await pipeSync(file, file_path);
                //let stat = await pipeSync(file, file_path);
                //let workbook = XLSX.readFile(file_path);
                let workbook = XLSX.readFile(file.path);
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
                            jsonOb[dict_excel_temp_col[e.replace(/[0-9]{1,}/, '1')]] = workSheet[e].v.toString();
                        } else {
                            flag = e.match(/[0-9]{1,}/)[0];
                            json.push(jsonOb);
                            jsonOb = {};
                            jsonOb[dict_excel_temp_col[e.replace(/[0-9]{1,}/, '1')]] = workSheet[e].v.toString();
                        }
                    }
                }
                json.push(jsonOb);

                // let json = XLSX.utils.sheet_to_json(workSheet);
                let user_code = await tools.getUserCode(ctx);
                await d_excel.excelImport(affa_id, flow_id, user_code, regitem_id, temp_state, json);

                ctx.response.body = {result: 'succeed'};
                ctx.response.type = 'application/json';
            }
        } else {
            ctx.response.body = {result: 'failed',message:'参数不正确:affa_id=' + affa_id + ',flow_id=' + flow_id + ',regitem_id=' + regitem_id};
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
            let datas;
            // 流程外excel导入,目前只有个人消费贷维护一处
            if (affa_id === 'v11a7d403e8611e6b07e184f32ca6bca') {
                let user_code = await tools.getUserCode(ctx);
                if (user_code !== 'notLoggin') {
                    datas = await d_excel.loadAll_affaid_obj(affa_id,user_code);
                } else {
                    ctx.response.body = {result: 'failed',message:'未登录,无法获取user_code'};
                }
            } else {
                // 流程内excel导入
                datas = await d_excel.loadAll_affaid_flow(affa_id);
            }
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
			temp_state = 0,
            regitem_id = ctx.query.regitem_id;
        // console.log(regitem_id);
        if (flow_id !== undefined) {
            let user_code = await tools.getUserCode(ctx);
            let datas = await d_excel.loadAll_flowid(flow_id, user_code, regitem_id, temp_state);
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