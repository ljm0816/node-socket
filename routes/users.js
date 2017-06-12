var express = require('express');
var router = express.Router();

var userDao = require('../core/dao/user/userDao');

/* GET users listing. */
router.get('/aaa', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

module.exports = router;
