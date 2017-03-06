'use strict';
const http = require('http');
const connect = require('connect');
const httpProxy = require('http-proxy');
const queryString = require('query-string');
const proxy_fileupload = require('./proxy/proxy_fileupload.js');
const proxy_flow_new = require('./proxy/proxy_flow_new.js');
const proxy_flow_show = require('./proxy/proxy_flow_show.js');
const harmon = require('./utils/harmon');
const proxy = connect();
const config = require('./config').proxy;

// proxy.use('/x/workflow/rtnew', harmon([], [selects[0]], true));
// proxy.use('/x/workflow/rtnew', function (req, res, next) {
//   let parsed = queryString.parse(req._parsedUrl.query);
//   if(parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca'){
//     let harmonBinary = harmon([], [proxy_flow_new[0]], true);
//     harmonBinary(req, res);
//   }
//   next();
// });
proxy.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  // 合同审批流程 附件上传
  if(parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca'){
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }
  // 贷款投资合同录入流程
  if(parsed.flowid=='faca20a152f311e6892e184f32ca6bca'){
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  // 项目签报变更流程
  if(parsed.flowid=='o53659213e5c11e6a7bd184f32ca6bca'){
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  // 抵质押物录入流程
  if(parsed.flowid=='tc539970ff0911e694b4005056a60fd8'){
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  next();
});

proxy.use('/x/workflow/dealwith', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  if(parsed.nextnode=='X72D77CA26F1489F92A305DDED6BE002'){
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }
  next();
});

// proxy.use('/x/workflow/rtview', harmon([], [selects[2]], true));
// 项目签报审批流程 项目立项审批流程(合并)
proxy.use('/x/workflow/rtview', function (req, res, next) {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
  next();
});
// 项目签报审批流程 项目立项审批流程(合并)
proxy.use('/x/workflow/rtflow', function (req, res, next) {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
  next();
});

// 下载pdf
proxy.use('/x/intrustqlc/static/pdf', function (req, res, next) {
  res.type = 'mimetype';
  res.setHeader('Content-disposition', 'attachment; filename=1.pdf');
  next();
});
proxy.use('/node', function (req, res){
    httpProxy.createProxyServer({
      target: 'http://localhost:3000/'
    }).web(req, res);
  }
);
// 获取ip
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};
let ipHash = {},
    ip;
proxy.use('/', function (req, res){
  ip = getClientIp(req);
  if(ipHash[ip]==undefined){
    ipHash[ip] = config.target.shift();
    config.target.push(ipHash[ip]);
  }
  httpProxy.createProxyServer({
    target: ipHash[ip]
    // target: 'http://127.0.0.1:8071/'
  }).web(req, res);
});

proxy.listen(config.proxy_port);
console.log('代理服务器启动,监听端口 ' + config.proxy_port);