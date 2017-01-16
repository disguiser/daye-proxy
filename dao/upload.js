'use strict';
const Attachment = require('../models/Attachment');

var insert = async (flow_list_id, file_name, file_path, temp_id, next) => {
    let id;
    await Attachment.create({
        id: 'g-' + Date.now(),
        flow_list_id: flow_list_id,
        temp_id: temp_id,
        file_name: file_name,
        file_path: file_path,
    }).then(function (p) {
        console.log('created.' + p.id);
        id = p.id;
    }).catch(function (err) {
        console.log('failed: ' + err);
    });
    return id;
}

var find_by_id = async (id, next) => {
    var attachment = await Attachment.findOne({
        where: {
            id: id
        }
    });
    console.log(`find attachment: ${attachment.file_name}`);
    return attachment;
}

var find_by_fli = async (flow_list_id, next) => {
    var attachments = await Attachment.findAll({
        where: {
            flow_list_id: flow_list_id
        }
    });
    // console.log(`find attachment: ${attachments.file_name}`);
    return attachments;
}

var delete_by_id  = async (id, next) => {
    var attachment = await find_by_id(id, next);
    console.log(attachment);
    await attachment.destroy();
    console.log(`${attachment.name} was destroyed.`);
    return {success: attachment.file_path};
}
var delete_by_fli  = async (flow_list_id, next) => {
    let attachments = await find_by_fli(flow_list_id, next);
    for(let attachment of attachments){
        await attachment.destroy();
        console.log(`${attachment.name} was destroyed.`);
    }
    return {success: attachments};
}

var delete_by_ti = async (temp_id, next) => {
    var attachments = await Attachment.findAll({
        where: {
            temp_id: temp_id
        }
    });
    for (let attachment of attachments) {
        await attachment.destroy();
    }
    return {success: attachments};
}

module.exports = {
    find_by_id: find_by_id,
    find_by_fli: find_by_fli,
    insert: insert,
    delete_by_ti: delete_by_ti,
    delete_by_id: delete_by_id,
    delete_by_fli: delete_by_fli
};