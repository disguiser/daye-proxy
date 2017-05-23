'use strict';
// const http = require('http');
const connect = require('connect');
const HttpProxy = require('http-proxy');
const queryString = require('query-string');
const proxy_fileupload = require('./proxy/proxy_fileupload.js');
const proxy_flow_new = require('./proxy/proxy_flow_new.js');
const proxy_flow_show = require('./proxy/proxy_flow_show.js');
const proxy_flow_select = require('./proxy/proxy_flow_select.js');
const proxy_obj_new = require('./proxy/proxy_obj_new.js');
const proxy_flow_dealwith = require('./proxy/proxy_flow_dealwith.js');
const harmon = require('./utils/harmon');
const app = require('connect')();
const config = require('./config').proxy;

const d_flow = require('./dao/d_flow');

function createProxy(ip){
    let httpProxy = HttpProxy.createProxyServer({
      target: ip
    });
    httpProxy.on('error', function (err, req, res) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Something went wrong. And we are reporting a custom error message.');
    });
    return httpProxy;
  }

// 贷款投资合同录入流程 + 抵质押物录入流程 + 收款流程 + 资产解押审批流程 + 放款审批流程(消费贷及房抵贷)
let proxy_flow_new_dict = [
  'faca20a152f311e6892e184f32ca6bca',
  'tc539970ff0911e694b4005056a60fd8',
  'v7608f2e3e8811e688c2184f32ca6bca',
  'v11a7d403e8611e6b07e184f32ca6bca',
  'v4b02a4f3e8a11e6ac80184f32ca6bca',
  'wfee86703bb611e7ae5d000c294af360'
];
// 项目签报变更流程 + 中后期签报变更流程
let proxy_flow_select_dict = [
  'o53659213e5c11e6a7bd184f32ca6bca',
  'rdf83711470311e68bb0184f32ca6bca'
];
app.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  // 合同审批流程 附件上传
  if ( parsed.flowid=='afad680f3ec711e6ae92184f32ca6bca' ) {
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }
  // 贷款投资合同录入流程 + 抵质押物录入流程 + 收款流程 + 付款流程 + 资产解押审批流程 + 放款审批流程(消费贷及房抵贷)
  if ( proxy_flow_new_dict.indexOf(parsed.flowid)>=0 ) {
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  // 项目签报变更流程 + 中后期签报变更流程
  if (proxy_flow_select_dict.indexOf(parsed.flowid) >= 0) {
    let harmonBinary = harmon([], proxy_flow_select, true);
    harmonBinary(req, res);
  }
  next();
});

app.use('/x/workflow/dealwith', async (req, res, next) => {

  let harmonBinary = harmon([], proxy_flow_dealwith, true);
  harmonBinary(req, res);

  let parsed = queryString.parse(req._parsedUrl.query);
  let affair = await d_flow.find_affar_by_taskid(parsed.taskid);
  if(parsed.nextnode=='X72D77CA26F1489F92A305DDED6BE002'){ // 合同审批流程 业务部负责人
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }else if(affair != undefined && proxy_flow_select_dict.indexOf(affair.flow_id) >= 0){ // 项目签报变更流程 + 中后期签报变更流程
    let harmonBinary = harmon([], proxy_flow_select, true);
    harmonBinary(req, res);
  }
  next();
});

// app.use('/x/workflow/rtview', harmon([], [selects[2]], true));
app.use('/x/workflow/rtview', async (req, res, next) => {
  let parsed = queryString.parse(req._parsedUrl.query);
  let affair;
  if (parsed.taskid != undefined) {
    affair = await d_flow.find_affar_by_taskid(parsed.taskid);
  } else if (parsed.affaid != undefined) {
    affair = await d_flow.find_affar(parsed.affaid);
  }
  if (affair == undefined) {
    console.log('uuid可能不存在!!!!');
    next();
  }
  if (proxy_flow_select_dict.indexOf(affair.flow_id) >= 0) { // 项目签报变更流程 + 中后期签报变更流程
    let harmonBinary = harmon([], proxy_flow_select, true);
    harmonBinary(req, res);
  } else { // 项目签报审批流程 项目立项审批流程(合并) + 账户开户流程 + 销户流程
    let harmonBinary = harmon([], proxy_flow_show, true);
    harmonBinary(req, res);
  }
  next();
});
// 项目签报审批流程 项目立项审批流程(合并) + 收款流程 + 收支计划审批流程
app.use('/x/workflow/rtflow', async (req, res, next) => {
  let parsed = queryString.parse(req._parsedUrl.query);
  let affair;
  if (parsed.taskid != undefined) {
    affair = await d_flow.find_affar_by_taskid(parsed.taskid);
    // 项目签报变更流程 + 中后期签报变更流程
    if (proxy_flow_select_dict.indexOf(affair.flow_id) >= 0) {
      let harmonBinary = harmon([], proxy_flow_select, true);
      harmonBinary(req, res);
    } else {
      let harmonBinary = harmon([], proxy_flow_show, true);
      harmonBinary(req, res);
    }
  }
  next();
});
// 交易对手维护
let proxy_obj_new_dict = [
  'v747d92ec81311e68aa0005056a687a8',
  'c588f5c0c81311e68438005056a687a8'
];
app.use('/f/v/objedit', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  if (proxy_obj_new_dict.indexOf(parsed.clsid) >= 0) {
    let harmonBinary = harmon([], proxy_obj_new, true);
    harmonBinary(req, res);
  }
  next();
});
// 下载pdf
app.use('/x/intrustqlc/static/pdf', function (req, res, next) {
  res.type = 'mimetype';
  res.setHeader('Content-disposition', 'attachment; filename=1.pdf');
  next();
});
app.use('/node', function (req, res){
    // proxy = httpProxy.createProxyServer({
    //   target: 'http://localhost:3000/'
    // }).web(req, res);
    createProxy('http://localhost:3000/').web(req, res);
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
app.use('/', function (req, res){
  ip = getClientIp(req);
  if(ipHash[ip]==undefined){
    ipHash[ip] = config.target.shift();
    config.target.push(ipHash[ip]);
  }
  // proxy = httpProxy.createProxyServer({
  //   target: ipHash[ip]
  //   // target: 'http://127.0.0.1:8071/'
  // }).web(req, res);
  createProxy(ipHash[ip]).web(req, res);
});

app.listen(config.proxy_port);
console.log('代理服务器启动,监听端口 ' + config.proxy_port);