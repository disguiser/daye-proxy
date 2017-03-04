'use strict';
const d_dict = require('../dao/d_dict.js');

// 流程展示
module.exports = function (router) {
    // 通过字典id找字典名称 涉及流程: 贷款投资合同录入流程
    router.get('/getDictName/:dict_id', async (ctx, next) => {
        let dict_id = ctx.params.dict_id;
        ctx.response.body = await d_dict.find_guarantor_dict(dict_id, next);
    });
}