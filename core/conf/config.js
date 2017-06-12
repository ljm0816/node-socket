/**
 * 基本配置
 * @type {exports|module.exports}
 */

var routesConfig = require("./routesConfig");
var filterUrlConfig = require("./filterUrlConfig");

exports.initBase = {
    //基础全局配置
    base:{
        SERVER_NAME:"min-mall-backend",
        SERVER_PORT: 3000,//服务启动端口
        ENV:"development", //development production
        contextPath:"",//网站前缀
        resourcePath:"http://localhost:3000/"//资源路径
    },


    //session配置
    sessionOption:{
        type:{
            local:"local",//使用本地
            redis:"redis"//使用redis
        },
        select:"local",//如果选择 local则使用本地,否则使用redis
        name:"sessionId",
        rolling:true,
        cookie : {
            "maxAge" : 2592000
        },
        opt:{
            session_key: "sid",
            secret:"node",
            resave:true,
            saveUninitialized:true
        },
        conf:{
            host:"192.168.2.166",
            port:6379,
            ttl:2592000,
            prefix:"node_"
        }
    },


    //cookies配置
    cookiesOption:{
        domain:".jqit020.com",
        path:"/",
        maxAge:86400000,
        secure:false,
        httpOnly:true
    },


    //过滤器配置
    filtersOption:{
        type:{
            backend:"backend",//后台,在urls填写则不拦截
            fortend:"fortend",//前台,在url填写则拦截
            test:"test"//测试，不拦截
        },
        select:"test",//声明前台还是后台
        loginUrl:"login.html",//微信认证
        urls:filterUrlConfig.urls
    },


    //错误配置
    errorOption:{
        isWebApi:false,//是否web api
        errorPage:"error", //生产环境
        devErragePage:"error",  //开发环境
        errJson:{//错误信息
            code:"-1",
            message:"系统请求异常",
            data:undefined,
            version:"1.0"
        }
    },



    //日志配置
    loggerOption:{
        "customBaseDir" :"/Users/leejohn/logs/node/node-demo/",
        "customDefaultAtt" :{
            "type": "dateFile",
            "absolute": true,
            "alwaysIncludePattern": true
        },
        "appenders": [
            {"type": "console", "category": "console"},
            {"pattern": "debug_yyyyMMddhh.logs", "category": "logDebug"},
            //{"pattern": "warn_yyyyMMddhh.logs", "category": "logWarn"},
            //{"pattern": "error_yyyyMMddhh.logs", "category": "logErr"},
            //{"pattern": "trace_yyyyMMddhh.logs", "category": "logTrace"},
            //{"pattern": "fatal_yyyyMMddhh.logs", "category": "logFatal"},
            {"pattern": "info_yyyyMMddhh.logs", "category": "logInfo"}
        ],
        "replaceConsole": true,
        "levels":{ "logDebug": "DEBUG", "logInfo": "INFO", "logWarn": "WARN", "logErr": "ERROR","logTrace":"TRACE","logFatal":"FATAL","console":"debug"}
    },


    //http https 默认选项
    httpOption:{
        host:"127.0.0.1",
        port:80,
        httpType:"http",
        postType:"json"
    },

    //redis 配置
    redisOption:{
        isStart:false,//是否启动
        host:"192.168.2.166",
        port:6379,
        expire:60,
        option:{}
    },

    //redis-cluster 配置
    redisClusterOption:{
        isStart:false,
        timeOut:7*24*60*60*10*1000,
        address:[
            {host:"192.168.2.166",port:6381},
            {host:"192.168.2.166",port:6382},
            {host:"192.168.2.166",port:6383},
            {host:"192.168.2.166",port:6384},
            {host:"192.168.2.166",port:6385},
            {host:"192.168.2.166",port:6386}
        ]
    },

    //mysql  配置
    mysqlOption: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database:'node',
        port: 3306
    },

    //路由配置
    routesOption:routesConfig.allRoutes

}


/**
 * 设置cookies
 * @param res
 * @param key
 * @param value
 */
exports.setCookies = function(res,key,value){
    setCookies(res,key,value,this.initBase.cookiesOption);
}


/**
 * 删除cookies
 * @param res
 * @param key
 * @param value
 */
exports.deleteCookies = function(res,key){
    var cookiesOption={
        domain:this.initBase.cookiesOption.domain,
        path:this.initBase.cookiesOption.path,
        maxAge:0,
        secure:false,
        httpOnly:true
    };
   setCookies(res,key,undefined,cookiesOption);
}


/**
 * 设置cookies
 * @param res
 * @param key
 * @param value
 * @param configData
 */
function setCookies(res,key,value,configData){
    var cookiesOption = configData;
    res.cookie(key, value, {
        httpOnly:cookiesOption.httpOnly,
        domain:cookiesOption.domain,
        path:cookiesOption.path,
        maxAge:cookiesOption.maxAge,
        secure:cookiesOption.secure
    });
}

var COOKIES_USER="COOKIES_USER";
var SESSION_USER="SESSION_USER";
exports.setCookiesUser=function(res,user){
    setCookies(res,COOKIES_USER,user);
}
exports.getCookiesUser=function(req){
    return req.cookies.COOKIES_USER;
}
exports.setSessionUser=function(req,user){
    req.session.SESSION_USER=user;
}
exports.getSessionUser=function(req){
    return req.session.SESSION_USER;
}

