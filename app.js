'use strict';
const Koa = require('koa');
const logger = require('koa-logger');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const path = require('path');

const app = new Koa();

// log requests
app.use(logger());

// custom 404
app.use(serve(path.join(__dirname, '/public')));

app.use(async (ctx, next) => {
  console.log(`通过 ${ctx.request.method} ${ctx.request.url}...`);
  await next();
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

app.use(router.routes());
// listen
module.exports = app;
