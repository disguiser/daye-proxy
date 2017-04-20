'use strict';
const ExcelTemp = require('../models/ExcelTemp');
const GridColumns = require('../models/GridColumns');

let excelImport = async (flow_id, json) => {
    let values = [],
        now = Date.now();
    for (let j of json) {
        values.push({
            flow_id: flow_id,
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
let loadAll = async (flow_id) => {
    var datas = await ExcelTemp.findAll({
        where: {
            flow_id: flow_id
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
        attributes: [
            'id', 'title', 'type', 'columnClass'
        ],
        where: {
            flow_id: flow_id
        }
    });
    return result;
}
module.exports = {
    excelImport: excelImport,
    loadAll: loadAll,
    remove: remove,
    gridColumns: gridColumns
}