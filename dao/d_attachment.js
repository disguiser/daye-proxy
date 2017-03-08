'use strict';
const Attachment = require('../models/Attachment');

var insert = async (flow_list_id, file_name, file_size, upload_time, file_path, temp_id) => {
    let attachment = await Attachment.create({
        flow_list_id: flow_list_id,
        temp_id: temp_id,
        file_name: file_name,
        file_size: file_size,
        file_path: file_path,
        upload_time: Date.now()
    });
    // console.log('created.' + attachment.id);
    return attachment.id;
}

var find_by_id = async (id) => {
    var attachment = await Attachment.findOne({
        where: {
            id: id
        }
    });
    // console.log(`find attachment: ${attachment.file_name}`);
    return attachment;
}

var find_by_fli = async (flow_list_id) => {
    var attachments = await Attachment.findAll({
        where: {
            flow_list_id: flow_list_id
        }
    });
    // console.log(`find attachment: ${attachments.file_name}`);
    return attachments;
}
// 多个 flow_list_id
var find_by_flis = async (flow_list_ids) => {
    var attachments = await Attachment.findAll({
        where: {
            flow_list_id: {
                $in: flow_list_ids
            }
        }
    });
    // console.log(`find attachment: ${attachments.file_name}`);
    return attachments;
}

var delete_by_id  = async (id) => {
    var attachment = await find_by_id(id);
    // console.log(attachment);
    await attachment.destroy();
    console.log(`${attachment.name} was destroyed.`);
    return {success: attachment.file_path};
}
var delete_by_fli  = async (flow_list_id) => {
    let attachments = await find_by_fli(flow_list_id);
    for(let attachment of attachments){
        await attachment.destroy();
        console.log(`${attachment.name} was destroyed.`);
    }
    return {success: attachments};
}

var delete_by_ti = async (temp_id) => {
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
    find_by_flis: find_by_flis,
    insert: insert,
    delete_by_ti: delete_by_ti,
    delete_by_id: delete_by_id,
    delete_by_fli: delete_by_fli
};