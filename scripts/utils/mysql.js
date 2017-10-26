/**
 * Created by Jacky on 2017/10/25.
 */

let mysql = require('mysql');

let _mysql = function () {};

_mysql.prototype.init = function (host, port, user, password, database) {
    console.log("sql init:", host, port, user, password, database);
    this.pool = mysql.createPool({
        host: host,
        port: port,
        user: user,
        password: password,
        database: database
    });
};

_mysql.prototype.query = function (sql,callback) {
    if (!sql) return;
    this.pool.getConnection((err, conn) => {
        if (err) {
            if (callback)callback(false);
            return;
        }

        conn.query(sql, (qerr, vals, fields) => {
            //释放连接
            conn.release();
            //事件驱动回调
            if (callback) {
                callback(qerr, vals, fields);
            }

        });
    });
};

module.exports = _mysql;