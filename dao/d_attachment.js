'use strict';
const Attachment = require('../models/Attachment');

let insert = async (flow_list_id, file_name, file_size, upload_time, file_path, temp_id) => {
    let attachment = await Attachment.create({
        flow_list_id: flow_list_id,
        temp_id: temp_id,
        file_name: file_name,
        file_size: file_size,
        file_path: file_path,
        upload_time: Date.now()
    });
    // console.log(JSON.stringify(attachment));
    return attachment.ID;
}

let find_by_id = async (id) => {
    let attachment = await Attachment.findOne({
        where: {
            id: id
        }
    });
    // console.log(`find attachment: ${attachment.file_name}`);
    return attachment;
}

let find_by_fli = async (flow_list_id) => {
    let attachments = await Attachment.findAll({
        where: {
            flow_list_id: flow_list_id
        }
    });
    // console.log(`find attachment: ${attachments.file_name}`);
    return attachments;
}

let find_by_ti = async (temp_id) => {
    let attachments = await Attachment.findAll({
        where: {
            temp_id: temp_id
        }
    });
    return attachments;
}
// 多个 flow_list_id
let find_by_flis = async (flow_list_ids) => {
    let attachments = await Attachment.findAll({
        where: {
            flow_list_id: {
                $in: flow_list_ids
            }
        }
    });
    // console.log(`find attachment: ${attachments.file_name}`);
    return attachments;
}

let delete_by_id  = async (ctx, id) => {
    let attachment = await find_by_id(id);
    // console.log(attachment);
    await attachment.destroy();
    ctx.logger.debug(`${attachment.name} was destroyed.`);
    return {success: attachment.file_path};
}
let delete_by_ids = async (ctx, ids) => {
    let result = await Attachment.destroy({
        where: {
            id: {
                $in: ids
            }
        }
    });
    ctx.logger.debug(`attachments ${ids} was destroyed.`);
}
let delete_by_fli  = async (flow_list_id) => {
    let attachments = await find_by_fli(flow_list_id);
    for(let attachment of attachments){
        await attachment.destroy();
        console.log(`${attachment.name} was destroyed.`);
    }
    return {success: attachments};
}

let delete_by_ti = async (temp_id) => {
    let attachments = await Attachment.findAll({
        where: {
            temp_id: temp_id
        }
    });
    for (let attachment of attachments) {
        await attachment.destroy();
    }
    return {success: attachments};
}
let find_by_lu = async (list_uuid) => {
    let attachment = await Attachment.findOne({
        where: {
            flow_list_id: list_uuid
        }
    });
    return attachment;
}

module.exports = {
    find_by_id: find_by_id,
    find_by_fli: find_by_fli,
    find_by_flis: find_by_flis,
    find_by_ti: find_by_ti,
    insert: insert,
    delete_by_ti: delete_by_ti,
    delete_by_id: delete_by_id,
    delete_by_ids: delete_by_ids,
    delete_by_fli: delete_by_fli
};