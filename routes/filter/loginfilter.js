/**
 * Created by DRAGON on 2017/4/30.
 */
var baseConfig = require('../../core/conf/config');
/**
 * 过滤器
 * @param app
 * @param config
 */
exports.filterInit = function(app,config) {
    //过滤器配置
    var filterConf = config.filtersOption;
    //设置路径
    function setCtx(res){
        //路径
        var contextPath = config.base.contextPath;
        if(contextPath == undefined || contextPath == ""){
            contextPath = "";
        } else if(contextPath.length == 1 && contextPath == "/" ){
            contextPath = "";
        }else if(contextPath.length > 1){
            if(contextPath.endWith("/")){
                contextPath = contextPath.substr(0,contextPath.length-1);
            }
            if(contextPath.indexOf("/") != 0){
                contextPath = "/" + contextPath;
            }
        }
        res.locals.ctx = contextPath;//<%=ctx%> 可以获取到
        res.locals.resourcePath = config.base.resourcePath;
        return contextPath;
    }

    /**
     *  所有过滤
     *  如果是前台则配置需要拦截的接口
     */
    app.all('/*', function(req, res, next){
        var ctx = setCtx(res);
        /*
        console.log("******************");
        console.log(req.header("Content-Type"));
        console.log("******************");
        */
        if(filterConf.select == filterConf.type.backend){//后台
            //--系统过滤连
            if (checkNoFilter(req,ctx)) {
                next();
            } else {
                var sessionUser = baseConfig.getSessionUser(req);
                if(sessionUser == undefined){//未登录
                    req.session.redirectUrl =  req.originalUrl;//先记录为登录前url
                    if(filterConf.loginUrl.length>1 && filterConf.loginUrl.startWith("/")){
                        res.redirect(ctx + filterConf.loginUrl);//从定向到login页面
                    }else{
                        res.redirect(ctx + "/" + filterConf.loginUrl);//从定向到login页面
                    }
                }else{
                    next();
                }
             }
        }else if(filterConf.select == filterConf.type.fortend){//前台
            if(!checkFilter(req,ctx)){
                req.session.redirectUrl =  req.originalUrl;//先记录为登录前url
                if(filterConf.loginUrl.length>1 && filterConf.loginUrl.startWith("/")){
                    res.redirect(ctx + filterConf.loginUrl);//从定向到login页面
                }else{
                    res.redirect(ctx + "/" + filterConf.loginUrl);//从定向到login页面
                }
            }else {
                next();
            }
        } else {
            next();
        }
    });


    /**
     *  过滤器，规则：
     *  如果是前台则配置需要拦截的接口
     */
  /*  app.use(function(req, res, next) {
        next();
    });*/


    /**
     * 前台拦截url
     * @param req
     * @param ctx
     * @returns {boolean}
     */
    function checkFilter(req,ctx){
        return !checkNoFilter(req,ctx);
    }

    /**
     * 后台拦截
     * @param req
     * @returns {boolean}
     */
    function checkNoFilter(req,ctx){
        var reqUrl = req.originalUrl;
       // console.log("请求URL-------------"+reqUrl);
        var urls = filterConf.urls;
        //console.log("系统过滤连-------------"+urls);
        for(var i=0;i<urls.length;i++){
            var nofilterUrl =  urls[i];
            if(nofilterUrl == "/"){
                nofilterUrl = "";
            }
            var noFilter = ctx + "/" + nofilterUrl;
           // console.log("noFilter-------------"+noFilter);

            //相等
            if(noFilter == reqUrl){
                return true;
            }

            //以此字符串开始
            if(reqUrl.startWith(noFilter)){
                return true;
            }
        }
        return false;
    }

}

