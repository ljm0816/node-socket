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


module.exports = router;
