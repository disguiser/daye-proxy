'use strict';
const temple = require('../utils/temple.js');
const flow = require('../dao/flow.js');
// 流程展示
module.exports = function (router) {
    router.get('/get_table/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let flow_id = await flow.get_flow_id(affa_id);
        console.log(flow_id);
        var res;
        if(flow_id == 'de19f3e165a911e68d9140f02f0658fc'){
            // console.log('aaaaaaaa');
            res = {
                success: temple.render('table.html' ,{ attachments: ''})
            }
        } else {
            res = {fail: 'none'};
        }
        ctx.response.body = res;
    });
}