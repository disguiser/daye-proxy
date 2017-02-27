# 项目文档
项目基于nodejs技术实现,至少需对nodejs技术有初步的了解,在此js不单单是运行在浏览器端的语言,因此搞清项目中哪些是`服务端运行`的程序,哪些是`浏览器端运行`的代码是十分必要的.项目分为两大块,因此占用两个端口.

首先是`代理模块`,原理是在用户浏览器到python服务通讯的线路之间加了一层服务,实际操作变成浏览器输入代理服务的ip以及端口,发出请求,代理对用户请求不做处理直接发送给配置好的指定python服务,python服务返回响应,代理对响应进行判断是否属于要做二次处理的页面,如果属于则处理完再返回给用户浏览器,为了实现更加容易,这里的处理只是注入一些js脚本,删除一些有冲突的脚本之类的简单操作

而更加复杂的操作由注入的脚本在浏览器端完成,这时候会涉及到某些异步的二次请求,比如到数据库拿数据,那就需要新的web服务.考虑到python环境的各种复杂性,决定用0代码倾入量的方案,也就是相应的web服务也用nodejs实现,也就是这里的第二个模块,即`web服务模块`,这个模块就是常见的mvc模式
## 环境搭建
* 安装visual studio code
* 安装nodejs 6.9.1
* 打开cmd,输入以下命令,显示版本号则安装成功
    > node -v
* 继续输入
    > npm install nrm
* 成功后输入
    > nrm ls
* 正常会显示各种源,我们选择淘宝的源
    > nrm use taobao
* 安装git
* 指定一个项目目录,右键鼠标,选择Git Bash here,输入
    > git clone http://git.oschina.net/disguiser/daye
* 进入项目目录
    > cd daye
* 安装依赖库
    > npm install
* 右键项目目录,选择open with code
## 项目目录解释
### controller
前端控制器,接收处理请求,以及某些业务逻辑
### dao
数据访问对象,操作数据库
### models
对象与数据表关系映射模型,字典
### node_modules
用到的外部库
### proxy
代理选择器,对代理的页面进行具体的操作在此编写
### public
前端文件
### template
模版目录
### utils
工具目录
### .gitignore
配置git忽略指定文件以及文件夹
### app.js
服务模块的入口
### config.js
项目的配置文件,配置数据库以及文件上传目录
### package.json
项目依赖外部模块的配置文件
### proxy.js
代理模块的入口,对指定路径的代理在此配置
### start.js
启动文件
## 语法简介
项目使用最新的ES7语法,我们在浏览器里写的一般都是ES5的语法,因此这里的语法比浏览器端多了一些新概念新功能

在浏览器里,只要引入html里的js文件里的方法,都可以相互调用,node里则需要声明引入

引入别的文件内定义的函数:
```javascript
const filesize = require('目录/文件名');
```
定义的函数能被别的文件引入:
```javascript
module.exports = {
    函数名: 函数名
}
```
`const` 声明常量

`let` 声明变量用,一般情况下等同于 `var`,这里推荐用let,两者差异,自行搜索

`=>` 箭头函数,匿名函数 function(x,y){} 的改进语法

`async await`用于将异步程序改成同步程序,javascript是单线程语言,为了不阻塞唯一的线程,保证性能,耗时操作比如读取数据库,读取文件之类的操作都是异步的,所谓异步就是js不会停在这里等待数据库返回结果才继续执行下面的操作,而是继续执行下去,如果下面的逻辑依赖数据库返回的结果,我们就只能将逻辑封装在回调函数里,传给异步语句.
但是这样破坏了原本的代码结构,回调函数一多,代码可读性就会变得极差,该语法就是为了解决这个问题被引入的,通过该语法就可以像在java里写同步代码一样写js代码了

## 案例实现简介
### 项目签报审批流程 与 项目立项审批流程(合并) 正文中添加项目编号
首先需要对指定的url进行过滤,毕竟我们只需要对某个特定页面进行脚本注入.分析python服务里流程页面的展示特性,发现`待处理事务`以及`未完结事务`这两个入口进去url并不相同,因此这两个url都需要在正文里加入项目编号,遂在proxy.js里添加如下代码
```javascript
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
```
以此实现了拦截这两个路径并应用proxy_flow_show.js里的逻辑,即在页面追加标签
```html
<script type="text/javascript" src="/node/workflow_show.js"></script>
```
至此,脚本得以注入,代理的任务结束

接下来,页面被浏览器加载后,workflow_show.js的脚本开始执行,判断url上存在taskid还是affaid(待处理事务进去url上为taskid,未完结事务进去则为affaid),并将该id传给对应web api

这时候来到了controllrts目录下的c_flow_show.js,其内部实现了两个api一个处理affaid一个处理taskid,逻辑都是通过id取到flow_id,再根据flow_id对应到相应的函数,因此这里先增加if判断,再增添一个处理具体业务逻辑的方法,`projectReport`

项目签报审批流程以及项目立项审批流程(合并)的逻辑相对简单,只需到数据库取个`项目编号`,拼个字符串,直接返回即可,浏览器端的ajax请求会在回调函数里直接将字符串写入`正文内容`.

而数据库取数逻辑都统一在dao目录下d_flow.js里实现,添加函数`find_project_info_by_problem_id`,内部执行sql,返回结果
```sql
select REGITEM_NO from INTRUSTQLC..QLC_TITEMREGINFO where regitem_id=
(select REGITEM_ID from INTRUSTQLC..QLC_TITEMPBINFO where problemid='${problem_id}')
```

## 附录
### 程序里用到的uuid对应涵义
* R29FFCA438734A42AE6409144A1D78A3-信托经理
* PBB558EE7E914339B01828AC11437874-业务部负责人
* D6887042FAD54274857C6A48018A820F-合规风控负责人

* qba4418052fc11e68f55184f32ca6bca-项目签报审批流程(正文中显示项目编号)
* b395b7615f9811e6b480b888e3e688de-产品发行(信托产品发行确认单)
* afad680f3ec711e6ae92184f32ca6bca-合同审批(附件上传)

* be3910515f9711e68e53b888e3e688de-信托项目是否已上会
* dabb57b05f9711e69f08b888e3e688de-是否向银监局报备
* f7d376705f9711e6afb0b888e3e688de-承诺函是否办理完全
* o220f1c05f9811e68f9ab888e3e688de-交易文件签署是否齐备
* pc5997405f9811e6bf9eb888e3e688de-终审意见是否全部落实
* qc2f64ae5f9811e690e4b888e3e688de-是否取得东方总公司风险部业务额度批复意见
* r6cdbf1e5f9811e696b6b888e3e688de-交易合同及有关法律文件是否面签
* s57ebb9e5f9811e69ea9b888e3e688de-终审过会通知单是否签批
* f7d376705f9711e6afb0b888e3e688de-承诺函是否办理完全

* ofbb75305f9811e6b61cb888e3e688de-法律意见书