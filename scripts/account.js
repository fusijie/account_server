/**
 * Created by Jacky on 2017/10/25.
 */

let fs = require('fs');
let process = require('process');

let sql = require('./utils/sql');
let config = require('./utils/config');
let server = require("./server");

let conf = null;

let init = function () {
    try {
        conf = fs.readFileSync("config.json", "utf-8");
        global.config = JSON.parse(conf);
    } catch (e) {
        //  read setting from env
        global.config = {
            mysql: {
                host: process.env.GM_MYSQL_HOST || "127.0.0.1",
                port: process.env.GM_MYSQL_PORT || 3306,
                user: process.env.GM_MYSQL_USER || "root",
                password: process.env.GM_MYSQL_PASSWORD || "",
                database: process.env.GM_MYSQL_DATABASE || "game_gm",
            }
        };
    }

    if (!global.config || !global.config.mysql.host) {
        console.log("can't find valid config");
        return false;
    }else {
        return true;
    }
};

let start = function () {
    let sqlConfig = global.config.mysql;
    config.init(sqlConfig);
    config.getServerConfig((conf) => {
        if (!conf) {
            throw "Can't get account config from gm.server_list!";
        }
        config.getAccountSqlConfig((cfg) => {
            if (cfg && cfg.ip) {
                sql.init(
                    cfg.ip,
                    cfg.port || 3306,
                    cfg.user || "root",
                    cfg.password || "",
                    cfg.db || "game_account");
                server.init().start(conf.port);
            } else {
                throw "Can't get account_sql config from gm.server_list!";
            }
        });
    });
};

if (init()) {
    start();
}

