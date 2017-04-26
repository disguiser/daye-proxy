const fs = require('mz/fs');
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
module.exports = {
    pipeSync: pipeSync,
    isEmpty: isEmpty,
    includeEmpty: includeEmpty
}