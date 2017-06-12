var session       = require('express-session');
var RedisStore    = require("connect-redis")(session);


// 配合express用的方法
exports.sessionInit = function(app,config) {

    var sessionOpt = config.sessionOption;

    if (sessionOpt.select==sessionOpt.type.redis){//redis
        var redisStore = new RedisStore(sessionOpt.conf);
        var redisSession = session({
            name : sessionOpt.name,
            cookie:sessionOpt.cookie,
            store:redisStore,//配置
            session_key: sessionOpt.session_key,
            secret: sessionOpt.opt.secret,
            resave: sessionOpt.opt.resave,
            rolling:sessionOpt.rolling,
            saveUninitialized: sessionOpt.opt.saveUninitialized
        });
        app.use(redisSession);
    }else if (sessionOpt.select==sessionOpt.type.local){//本地session
        var localSession = session({
            type:"local",
            session_key: sessionOpt.opt.session_key,
            secret:sessionOpt.opt.secret,
            resave:sessionOpt.opt.resave,
            saveUninitialized:sessionOpt.opt.saveUninitialized
        });
        app.use(localSession);
    }else {//redis-cluster

    }


}
