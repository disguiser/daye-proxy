'use strict';
const ExcelTemp = require('../models/ExcelTemp');
const GridColumns = require('../models/GridColumns');
const sequelize = require('../utils/sequelize_init').pjmain;
const tools = require('../utils/tools');
const moment = require('moment');

let excelImport = async (affa_id, flow_id, user_code, regitem_id, temp_state, json) => {
    let values = [],
        now = moment().format('YYYY-MM-DD hh:mm:ss');
     console.log('==========================');
    for (let j of json) {
        values.push({
            affa_id: tools.isEmpty(affa_id) ? null : affa_id,
            flow_id: flow_id,
            user_code: tools.isEmpty(user_code) ? null : user_code,
            regitem_no: tools.isEmpty(regitem_id) ? null : regitem_id,
			temp_state: tools.isEmpty(temp_state) ? null : temp_state,
            col010: j.col010,
            col020: j.col020,
            col030: j.col030,
            col040: j.col040,
            col050: j.col050,
            col060: j.col060,
            col070: j.col070,
            col080: j.col080,
            col090: j.col090,
            col100: j.col100,
            col110: j.col110,
            col120: j.col120,
            col130: j.col130,
            col140: j.col140,
            col150: j.col150,
            col160: j.col160,
            col170: j.col170,
            col180: j.col180,
            col190: j.col190,
            col200: j.col200,
            col210: j.col210,
            col220: j.col220,
            col230: j.col230,
            col240: j.col240,
            col250: j.col250,
            col260: j.col260,
            col270: j.col270,
            col280: j.col280,
            col290: j.col290,
            col300: j.col300,
            col310: j.col310,
            col320: j.col320,
            col330: j.col330,
            col340: j.col340,
            col350: j.col350,
            col360: j.col360,
            col370: j.col370,
            col380: j.col380,
            col390: j.col390,
            col400: j.col400,
            col410: j.col410,
            col420: j.col420,
            col430: j.col430,
            col440: j.col440,
            col450: j.col450,
            col460: j.col460,
            col470: j.col470,
            col480: j.col480,
            col490: j.col490,
            col500: j.col500,
            upload_time: now
        });
    }
    let importDatas = await ExcelTemp.bulkCreate(values);
    return importDatas;
}
let loadAll_affaid_flow = async (affa_id) => {
    let datas = await ExcelTemp.findAll({
        where: {
            affa_id: affa_id
        }
    });
    return datas;
}
let loadAll_affaid_obj = async (affa_id, user_code) => {
    let datas = await ExcelTemp.findAll({
        where: {
            affa_id: affa_id,
			user_code: user_code,
			temp_state:'0'
        }
    });
    return datas;
}
let loadAll_flowid = async (flow_id, user_code, regitem_id, temp_state) => {
    let datas = await ExcelTemp.findAll({
        where: {
            user_code: user_code,
            flow_id: flow_id,
            regitem_no: regitem_id,
			temp_state:temp_state
        }
    });
    return datas;
}
let remove = async (ids) => {
    let result = await ExcelTemp.destroy({
        where: {
            id: {
                $in: ids
            }
        }
    });
}
let gridColumns = async (flow_id) => {
    let result = await GridColumns.findAll({
        where: {
            flow_id: flow_id
        },
        order: [
            ['id']
        ]
    });
    return result;
}
module.exports = {
    excelImport: excelImport,
    loadAll_affaid_flow: loadAll_affaid_flow,
    loadAll_affaid_obj: loadAll_affaid_obj,
    loadAll_flowid: loadAll_flowid,
    remove: remove,
    gridColumns: gridColumns
}