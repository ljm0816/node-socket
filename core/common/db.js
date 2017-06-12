/**
 * Created by leejohn on 17/5/28.
 */
var mysql = require('mysql');
var config = require('../conf/config');
var db = {
    pool: mysql.createPool(config.initBase.mysqlOption),
    getConnection : function(callback){
      this.pool.getConnection(function(err, connection) {
        if (err) {
          callback(null);
          return;
        }
        callback(connection);
      });
    }
}

module.exports = db;