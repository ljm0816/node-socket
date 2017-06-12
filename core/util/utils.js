/**
 * Created by dragon on 16-7-31.
 * 全局的函数
 */


/**
 * 格式化端口
 * @param val
 * @returns {*}
 */
exports.normalizePort = function(val){
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}



/**
 * 获取远程请求IP
 * @param req
 * @returns {*}
 */
exports.getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};


/**
 * aes加密
 * @param data
 * @param key
 * @param iv
 * @returns {*}
 */
exports.aes = function (data,key,iv){
    var algorithm = 'aes-128-cbc';
    var crypto      = require('crypto');
    var cipher = crypto.createCipheriv(algorithm, key, iv)
    var encrypted = cipher.update(data, 'binary', 'base64')
    encrypted += cipher.final('base64');

    return encrypted;
}


/**
 * MD5散列
 * @param data
 * @returns {*}
 */
exports.md5= function(data){
    var crypto      = require('crypto');
    var md5         = crypto.createHash('md5');
    md5.update(data);
    var sign        = md5.digest('hex');
    return sign;
}

