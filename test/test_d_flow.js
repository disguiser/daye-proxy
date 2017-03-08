const sequelize = require('../utils/sequelize_init');
const d_flow = require('../dao/d_flow');

let c_find_affar_by_taskid = async () => {
    return await d_flow.find_affar_by_taskid('v5cb6d6202e211e7b389005056a60fd8');
}

(async () => {
    let affair = await c_find_affar_by_taskid();
    console.log(affair.flow_id);
    process.exit(0);
})();
