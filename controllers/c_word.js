'use strict';
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');

const fs = require('fs');
const path = require('path');

const urlencode = require('urlencode');

module.exports = function (router) {
    router.get('/word/:affa_id', async (ctx, next) => {
        let affa_id = ctx.params.affa_id;
        let scream = fs.createReadStream('./templates/template.docx');
        ctx.response.body = scream;
        ctx.response.type = 'mimetype';
        ctx.response.set('Content-disposition', 'attachment; filename='+urlencode('季度管理报告.docx'));
    });
}