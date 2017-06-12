var express = require('express');
var router = express.Router();
var captchapng = require('captchapng');

var func = require('../core/util/func');

/**
 * 图片验证码
 */
router.get('/imageCode', function(req, res, next) {
    var type = req.query.type;
    if (!type || type == ''){
      type = 'login';
    }

    var width=!isNaN(parseInt(req.query.width))?parseInt(req.query.width):100;
    var height=!isNaN(parseInt(req.query.height))?parseInt(req.query.height):30;

    var code = func.generateNum(4);

    var p = new captchapng(width,height, code);
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    var timestamp = new Date().getTime();

    var imageCode = {
        type:type,
        code:code,
        timestamp:timestamp
    };

    req.session.imageCode = imageCode;

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');

    res.writeHead(200, {
        'Content-Type': 'image/png'
    });

    res.end(imgbase64);
});


/**
 * 登录页面
 */
router.get('/login.html', function(req, res, next) {
    res.render('login');
});


/**
 * 登录
 */
router.post('/doLogin', function(req, res, next) {
    

    res.redirect('index');
});




module.exports = router;
