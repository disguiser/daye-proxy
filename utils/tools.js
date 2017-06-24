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
            ctx.logger.debug(`远程获取${user_code}`);
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
        ctx.logger.debug(`session中存在${user_code}`);
    }
    return user_code;
}

let splitBankNo = function(bank_no){                                             // 银行账号每4个空格隔开
    if(bank_no){
        bank_no = String(bank_no).replace(/\ +/g,'').replace(/[\r\n]+/g,'')      // 清除空格和回车
        var n = Number(bank_no);
        if (!isNaN(n)){
            var bank_no_len = bank_no.length;                                    // 长度
            if (bank_no_len > 4){                                                // 长度至少>4
                var blocks = Math.ceil(bank_no_len/4);                           // 分割次数
                console.log('blocks='+blocks);
                var start = 0;
                var t = 0;
                var bank_no_array = [];
                while(t < blocks){
                    var end = start + 4;
                    bank_no_array.push(bank_no.substring(start,end));
                    start = end;
                    t = t+1;
                }
                bank_no = bank_no_array.join(' ');
            }
        }
    }
    return bank_no;
}

module.exports = {
    pipeSync: pipeSync,
    isEmpty: isEmpty,
    includeEmpty: includeEmpty,
    getUserCode: getUserCode,
    splitBankNo:splitBankNo
}