require('babel-core/register')({
    presets: ['stage-3']
});
require('./proxy.js');
const app = require('./app.js');
app.listen(3000);
console.log('应用服务器启动,监听端口 3000');