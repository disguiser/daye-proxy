const fs = require('mz/fs');
const rp = require('request-promise');
const config = require('../config');
// async-busboy里的文件流是异步的, 需要用promise包装后变成同步
let pipeSync = (rs, file_path) => {
    let ws = fs.createWriteStream(file_path);
    rs.pipe(ws);
    return new Promise((resolve, reject) => {
        rs.on('end', () => resolve(fs.stat(file_path)));
        rs.on('error', reject);
    });
}
let includeEmpty = obj => {
    if (obj instanceof Array) {
        for (element of obj) {
            if (isEmpty(element)) {
                return true;
            }
        }
        return false;
    }
}
let isEmpty = obj => {
    if (obj === undefined || obj === 'undefined' || obj === null || obj === 'null' || obj === '' ) {
        return true;
    } else {
        return false;
    }
}

let getUserCode = async ctx => {
    let user_code;
    if (ctx.session.user_code === undefined) {
        let session_id = ctx.cookies.get('webpy_session_id');
        if (!isEmpty(session_id)) {
            user_code = await rp(`http://localhost:${config.proxy.proxy_port}/x/intrustqlc/session?session_id=${session_id}`);
            if (ctx.logger.debug()) {
                ctx.logger.debug(`远程获取${user_code}`);
            }
            if (user_code === 'notLoggin') {
                user_code = '';
            } else {
                ctx.session.user_code = user_code;
            }
        } else {
            user_code = '';
        }
    } else {
        user_code = ctx.session.user_code;
        if (ctx.logger.debug()) {
            ctx.logger.debug(`session中存在${user_code}`);
        }
    }
    return user_code;
}
module.exports = {
    pipeSync: pipeSync,
    isEmpty: isEmpty,
    includeEmpty: includeEmpty,
    getUserCode: getUserCode
}