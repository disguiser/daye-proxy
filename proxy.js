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
const proxy_flow_zxd = require('./proxy/proxy_flow_zxd.js');
const harmon = require('./utils/harmon');
const app = require('connect')();
const config = require('./config').proxy;

const d_flow = require('./dao/d_flow');

const logger = require('./utils/logger');


let httpProxy = HttpProxy.createProxyServer();

httpProxy.on('error', function (err, req, res) {
  logger.error(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. Check the python servers.');
});

/**
 * 贷款投资合同录入流程 + 抵质押物录入流程 + 收款流程 + 资产解押审批流程 + 
 * 放款审批流程(消费贷及房抵贷) + 资金信托合同登记流程 + 受益权转让审批流程 +
 * 财产信托合同登记流程
 * 信托登记审批流程
 */
let proxy_flow_new_dict = [
  'faca20a152f311e6892e184f32ca6bca',
  'tc539970ff0911e694b4005056a60fd8',
  'v7608f2e3e8811e688c2184f32ca6bca',
  'v11a7d403e8611e6b07e184f32ca6bca',
  'v4b02a4f3e8a11e6ac80184f32ca6bca',
  'wfee86703bb611e7ae5d000c294af360',
  'p688af403e6e11e6a580184f32ca6bca',
  'ta32efd13e8c11e6ae36184f32ca6bca',
  'p5b270cfdbdd11e691db1c3e84e5807c',
  'f059a1eedb1d11e7be6b005056a687a8',
  'ab6e048f3e6211e68067184f32ca6bca'
];
app.use('/x/workflow/rtnew', function (req, res, next) {
  let parsed = queryString.parse(req._parsedUrl.query);
  // 合同审批流程 合同审批流程(简易) 附件上传 资产解押审批流程
  if (['d70e099e240411e7a3af005056a687a8','afad680f3ec711e6ae92184f32ca6bca','v4b02a4f3e8a11e6ac80184f32ca6bca','q28638b01a2311e998fd005056a61cf9','c1cf5f0f8be711e98947005056a6a83a'].indexOf(parsed.flowid) >= 0) {
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }
  // 贷款投资合同录入流程 + 抵质押物录入流程 + 收款流程 + 付款流程 + 资产解押审批流程 + 放款审批流程(消费贷及房抵贷) + 资金信托合同登记流程 + 信托登记审批流程
  if ( proxy_flow_new_dict.indexOf(parsed.flowid)>=0 ) {
    let harmonBinary = harmon([], proxy_flow_new, true);
    harmonBinary(req, res);
  }
  next();
});

app.use('/x/workflow/dealwith', async (req, res, next) => {

  let harmonBinary = harmon([], proxy_flow_dealwith, true);
  harmonBinary(req, res);

  let parsed = queryString.parse(req._parsedUrl.query);
  // 合同审批流程 合同审批流程(非实质性变更) 资产解押审批流程 只有发起人撤回才有编辑内容的权限,所以判断url里存在的nextnode即可,无需查询flow_id
  if(['X72D77CA26F1489F92A305DDED6BE002', 'd7107aa4240411e7a832005056a687a8', 'V4E5281C10C94801B6DF6A1A58E2CACD'].indexOf(parsed.nextnode) >= 0) {
    let harmonBinary = harmon([], proxy_fileupload, true);
    harmonBinary(req, res);
  }
  // 信托登记审批流程 只有发起人撤回才有编辑内容的权限,所以判断url里存在的nextnode即可,无需查询flow_id
  if(['EA24B73C2E9142719FAFF460F4097AEA'].indexOf(parsed.nextnode) >= 0) {
    let harmonBinary = harmon([], proxy_flow_zxd, true);
    harmonBinary(req, res);
  }  
  next();
});

app.use('/x/workflow/rtview', async (req, res, next) => {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
  next();
});
// 项目签报审批流程 项目立项审批流程(合并) + 收款流程 + 收支计划审批流程
app.use('/x/workflow/rtflow', async (req, res, next) => {
  let harmonBinary = harmon([], proxy_flow_show, true);
  harmonBinary(req, res);
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
    httpProxy.web(req, res, {target: 'http://localhost:3000/'});
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
  httpProxy.web(req, res, {target: ipHash[ip]});
});

app.listen(config.proxy_port);
logger.info(`代理服务器启动,监听端口: ${config.proxy_port}`);

// process.on('uncaughtException', function(err){
//   logger.error(err);
// })