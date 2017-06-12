
##websocket聊天室demo

===================================工程结构=========================================
/-bin
    /www   启动文件
/-core
    /-util  (工具类)
        -http.js (http请求)
    /-conf
	    -config.js  (***最重要---初始化配置：路由配置,session,cookies,过滤器,日志 等等)
        -routesConfig.js 路由
	    -filterUrlConfig.js 过滤url
	    -restUul.js (调用第三方URL)
/-node_modules (依赖包)
/-public (前端静态文件)
    /-images(图片)
	/-javascripts (前端js)
	/-stylesheets (css)
/-routes
    -exception 异常
    -filter 过滤器
	-*.js (后端js接口)
/-views (前端模板页)
    -*.ejs (ejs模板)
-app.js	(程序启动入口文件)
-package,json (工程依赖说明)
-Gruntfile.js (构建工具)
/-sh
   -start.sh (部署启动文件)

==================================开发启动==========================================
方式1. >cnpm start















  
   
   
   
	


