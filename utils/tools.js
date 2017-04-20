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
module.exports = {
    pipeSync: pipeSync
}