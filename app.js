'use strict';
const Koa = require('koa');
const koaLogger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const path = require('path');
const session = require('koa-session');
const tools = require('./utils/tools');
const logger = require('./utils/logger');
// const sequelize = require('./utils/sequelize_init').pjmain;

const app = new Koa();

app.keys = ['keys', 'keykeys'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 3600000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(session(CONFIG, app));

// log requests
app.use(koaLogger());

// custom 404
app.use(serve(path.join(__dirname, '/public')));

app.use(async (ctx, next) => {
  ctx.logger = logger;
  await next();
});

app.use(async (ctx, next) => {
  // console.log(`通过 ${ctx.request.method} ${ctx.request.url}...`);
  let user_code = await tools.getUserCode(ctx);
  if (user_code === '') {
    ctx.redirect('/');
    return;
  } else {
    await next();
  }
  if (ctx.body || !ctx.idempotent) return;
  ctx.redirect('/node/404.html');
});


// parse request body:
app.use(bodyParser());

// serve files from ./public
// app.use(serve(path.join(__dirname, '/templates')));

require('./controllers/c_flow_upload.js')(router);

require('./controllers/c_flow.js')(router);

require('./controllers/c_excel.js')(router);

require('./controllers/c_word.js')(router);

app.use(router.routes());

app.on('error', function(err, ctx){
  logger.error('server error', err, ctx);
});

// listen
app.listen(3000);
logger.info('应用服务器启动,监听端口 3000');

// let option = process.argv;
// console.log(option);