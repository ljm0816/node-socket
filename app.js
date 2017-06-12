var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//补充字符串 以什么开始，以什么结尾
String.prototype.startWith=function(str){
  var reg=new RegExp("^"+str);
  return reg.test(this);
}
String.prototype.endWith=function(str){
  var reg=new RegExp(str+"$");
  return reg.test(this);
}


//工具类
var utils = require("./core/util/utils");
//配置文件
var config = require('./core/conf/config');
var app = express();

//===============视图引擎配置======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//=================资源配置=========================
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('env', config.initBase.base.ENV);//set environ


//======================log4js======================
var log4js = require('./core/util/logger');
log4js.loggerInit(config.initBase.loggerOption);

//======================session======================
var session = require('./core/util/session');
session.sessionInit(app,config.initBase);

//======================filter======================
var filter = require('./routes/filter/loginfilter');
filter.filterInit(app,config.initBase);

//===================路由配置=========================
var baseConf   = config.initBase.base;
var routesConf = config.initBase.routesOption;
if(undefined == routesConf||0 == routesConf.length){
  log4js.error("路由配置出错,HTTP服务器退出,请检查routes.json");
  process.exit();
}

for(var i=0;i<routesConf.length;i++){
  var route = require("./routes/"+routesConf[i]["route"]);
  var p  = routesConf[i]["path"];
  var cp = baseConf.contextPath;
  var routePath = "";
  if(cp == undefined || cp == ''){
    if(p.indexOf("/") != 0){
      p = "/" + p;
    }
    routePath = p;
  }else {
    if(cp.length>1 && cp.endWith("/")){
      cp = cp.substr(0,cp.length-1);
    }

    if(cp.indexOf("/") != 0){
      cp = "/" + cp;
    }
    if(p.indexOf("/") != 0){
      p = "/" + p;
    }
    routePath = cp + p;
    if(routePath.length>1 && !routePath.endWith("/")){
      routePath += "/";
    }
  }
  app.use(routePath,route);
}

//====================== redis ==========================
var redisOption = config.initBase.redisOption;
if(redisOption.isStart){
  var redis = require('./core/util/redis');
  redis.redisConnect(config.initBase);
}

//===================== redis-cluster====================
var redisClusterOption = config.initBase.redisClusterOption;
if (redisClusterOption.isStart){
  var cluster = require('./core/util/redis-cluster');
  cluster.redisClusterConnect(config.initBase);
}


//===================================exception================================================
var exception = require('./routes/exception/exception');
exception.exceptionInit(app,config.initBase.errorOption);


module.exports = app;
