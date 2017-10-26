/**
 * Created by Jacky on 2017/10/25.
 */

let mysql = require('../utils/mysql');

let serverListMap = {};
let cached_announcement = null;

const SQL_DATA_UPDATE_INTERVAL = 1000 * 30;

let config = {

    init: function (sqlConfig) {
        this.mysql = new mysql();
        this.mysql.init(sqlConfig.host, sqlConfig.port, sqlConfig.user, sqlConfig.password, sqlConfig.database);
        this.updateSqlData();
    },

    getServerConfig: function (cb) {
        const str = "select * from server_list where name='account'";
        this.mysql.query(str, (err, vars, field) => {
            if (err || !vars) {
                console.log("can't find config");
                cb(null);
                return;
            }
            cb(vars[0]);
        });
    },

    getAccountSqlConfig: function (cb) {
        const str = "select * from server_list where name='account_sql'";
        this.mysql.query(str, (err, vars, field) => {
            if (err || !vars) {
                console.log("can't find config");
                cb(null);
            }
            cb(vars[0]);
        });
    },

    getServerList: function (user_state) {
        return serverListMap[user_state] || [];
    },

    queryGamerServer() {
        const str = "select a.csid,a.name,a.author,b.ip,b.port,b.state from server_map a,server_game b where a.ssid=b.ssid;";
        this.mysql.query(str, (err, vars, field) => {
            if (err) {
                console.log("can't find server_name");
                return;
            }
            let serverList = vars;
            //  根据玩家状态，确定玩家可以看到的服务器列表，然后缓存起来
            //  server state：0：所有人不可见；1：所有玩家可见维护中, 2:所有玩家可见正常，11:只有GM账号可见
            //  玩家state:1，表示正常玩家
            serverListMap[1] = serverList.filter(function (i) {
                return i.state && i.state > 0 && i.state < 10;  // server state 的值看 sql 表 gm.server_game.state 列注释
            });
            //  玩家state:2，表示GM
            serverListMap[2] = serverList.filter(function (i) {
                return i.state && i.state > 0;
            });
        });
    },

    getAnnouncement: function () {
        return cached_announcement;
    },

    queryAnnouncement: function () {
        const sql_str = "SELECT `id`, `data` FROM `announcement` WHERE `published` = TRUE ORDER BY `id` DESC LIMIT 1";
        this.mysql.query(sql_str, (error, vals, fields) => {
            if (error) {
                console.log("SQL failure when query gm :" + sql_str, error);
                return;
            }
            cached_announcement = vals[0];
        });
    },

    updateSqlData: function () {
        this.queryGamerServer();
        this.queryAnnouncement();
        setInterval(() => {
            this.queryGamerServer();
            this.queryAnnouncement();
        }, SQL_DATA_UPDATE_INTERVAL);
    },

};

module.exports = config;