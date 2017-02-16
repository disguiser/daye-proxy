'use strict';
const http = require('http');
const connect = require('connect');
const httpProxy = require('http-proxy');
const queryString = require('query-string');
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

// 1跟2 共存会报错,遂只好分开写
// proxy.use('/x/workflow/rtnew', harmon([], [selects[1]], true));
proxy.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  // 合同审批 信托经理发起
  if(parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca'){
    console.log(proxy_flow_new[1]);
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  next();
});

proxy.use('/x/workflow/dealwith', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  if(parsed.nextnode=='X72D77CA26F1489F92A305DDED6BE002'){
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  next();
});

// proxy.use('/x/workflow/rtview', harmon([], [selects[2]], true));

proxy.use('/x/workflow/rtview', function (req, res, next) {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
  next();
});
// 项目签报审批流程
proxy.use('/x/workflow/rtflow', function (req, res, next) {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
  next();
});
proxy.use('/node', function (req, res){
    httpProxy.createProxyServer({
      target: 'http://localhost:3000/'
    }).web(req, res);
  }
);

proxy.use('/', function (req, res){
    httpProxy.createProxyServer({
      target: config.target
      // target: 'http://127.0.0.1:8071/'
    }).web(req, res);
  }
);

proxy.listen(config.proxy_port);
console.log('代理服务器启动,监听端口 ' + config.proxy_port);