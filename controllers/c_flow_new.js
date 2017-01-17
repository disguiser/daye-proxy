'use strict';
const fs = require('fs');
const d_attachment = require('../dao/d_attachment.js');
const temple = require('../utils/temple.js');
const urlencode = require('urlencode');
const parse = require('async-busboy');

module.exports = function (router) {
    // handle uploads
    router.post('/upload', async (ctx, next) => {
        const {files, fields} = await parse(ctx.req);
        var stream;
        console.log('caocaocao!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        let result = [];
        for (let key in fields) {
            console.log("key:"+key);
            console.log("value:"+fields[key]);
        }
        let temp_id = fields['another_temp_id'],
            flow_list_id = fields['flow_list_id'];
        if(temp_id!=undefined && temp_id!='' &&
        flow_list_id!=undefined && flow_list_id!=''){
            for (var i=0; i<files.length; i++){
                let file_name = files[i].filename;
                let file_path = "E:/audio/"+ Date.now() +file_name;
                stream = fs.createWriteStream(file_path);
                files[i].pipe(stream);
                console.log('uploading %s -> %s', file_name, file_path);
                let id = await d_attachment.insert(flow_list_id, file_name, file_path, fields['another_temp_id'], next);
                console.log('=========');
                console.log(id);
                result.push({
                    id: id,
                    file_name: file_name
                });
            }
            ctx.response.body = result;
        } else {
            ctx.response.body = {result: 'failed'};
        }
        ctx.response.type = 'application/json';
        // ctx.response.status = 200;
    });

    // flow_list_id:流程信托文件对应id
    router.get('/attachments/:flow_list_id', async (ctx, next) => {
        var flow_list_id = ctx.params.flow_list_id;
        var res;
        console.log('++++++++');
        console.log(flow_list_id);
        if( flow_list_id == 0 ) {
            res = temple.render('attachment.html' ,{ attachments: ''});
        } else {
            var attachments = await d_attachment.find_by_fli(flow_list_id, next);
            res = temple.render('attachment.html' ,{ attachments: attachments});
        }
        ctx.response.body = res;
    // console.log(res);
    });

    router.get('/delete_by_id/:id', async (ctx, next) => {
        var id = ctx.params.id;
        let attachment = await d_attachment.delete_by_id(id, next);
        if ( attachment.success != undefined ) {
            fs.unlinkSync(attachment.success);
            ctx.response.body = {result: 'successed'};
        } else {
            ctx.response.body = {result: 'failed'}
        }
    });
    router.get('/delete_by_fli/:flow_list_id', async (ctx, next) => {
        var flow_list_id = ctx.params.flow_list_id;
        let attachments = await d_attachment.delete_by_fli(flow_list_id, next);
        if ( attachments.success != undefined ) {
            for(let attachment of attachments.success){
                fs.unlinkSync(attachment.file_path);
            }
            ctx.response.body = {result: 'successed'};
        } else {
            ctx.response.body = {result: 'failed'}
        }
    });
    // 如果用户没有提交就关闭了页面,需删除该页面上传的附件
    router.get('/delete_by_ti/:temp_id', async (ctx, next) => {
        let temp_id = ctx.params.temp_id;
        let attachments = await d_attachment.delete_by_ti(temp_id, next);
        if ( attachments.success != undefined ) {
            for(let attachment of attachments.success){
                fs.unlinkSync(attachment.file_path);
            }
            ctx.response.body = {result: 'successed'};
        } else {
            ctx.response.body = {result: 'failed'}
        }
    });
    router.get('/download/:id', async (ctx, next) => {
        let id = ctx.params.id;
        console.log(id);
        let attachment = await d_attachment.find_by_id(id, next);
        var scream = fs.createReadStream(attachment.file_path);
        ctx.response.body = scream;
        ctx.response.type = 'mimetype';
        ctx.response.set('Content-disposition', 'attachment; filename='+urlencode(attachment.file_name));
    });
}