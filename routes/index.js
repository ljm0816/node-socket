var express = require('express');
var router = express.Router();
var captchapng = require('captchapng');

router.get('/', function (req, res, next) {
	res.redirect('index');
});

/**
 * 首页
 */
router.get('/index', function (req, res, next) {
	res.render('index', {title: "HELLO"});
});

router.post('/index', function (req, res, next) {
	console.log(req.query.a)
	console.log(req.body.a)
	res.send("OK");
});

/**
 * 欢迎页
 */
router.get('/welcome', function (req, res, next) {
	req.session.testAAA = "welcome";
	res.render('welcome');
});

/**
 * 返回json数据
 */
router.get('/testget', function (req, res, next) {
	res.send({title: 'Express111', env: app.get('env')});
});

/**
 * 返回json数据
 */

router.get('/chat', function (req, res, next) {
	var type = parseInt(req.query.type) || 1;
	console.log(type);
	res.render("chat",{type});
});

module.exports = router;
