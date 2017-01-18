'use strict';
const http = require('http');
const connect = require('connect');
const httpProxy = require('http-proxy');
const queryString = require('query-string');
const proxy_flow_new = require('./proxy/proxy_flow_new.js');
const proxy_flow_show = require('./proxy/proxy_flow_show.js');
const harmon = require('./utils/harmon');
const proxy = connect();

// proxy.use('/x/workflow/rtnew', harmon([], [selects[0]], true));
proxy.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  if(parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca'){
    let harmonBinary = harmon([], [proxy_flow_new[0]], true);
    harmonBinary(req, res);
  }
  next();
});

// 1跟2 共存会报错,遂只好分开写
// proxy.use('/x/workflow/rtnew', harmon([], [selects[1]], true));
proxy.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  if(parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca'){
    let harmonBinary = harmon([], [proxy_flow_new[1]], true);
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

proxy.use('/node', function (req, res){
    httpProxy.createProxyServer({
      target: 'http://localhost:3000/'
    }).web(req, res);
  }
);

proxy.use('/', function (req, res){
    httpProxy.createProxyServer({
      target: 'http://192.168.1.118:8080/'
      // target: 'http://127.0.0.1:8071/'
    }).web(req, res);
  }
);

proxy.listen(8000);
console.log('代理服务器启动,监听端口 8000');