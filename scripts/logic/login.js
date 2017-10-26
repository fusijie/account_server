/**
 * Created by Jacky on 2017/10/25.
 */

let event = require('../utils/event');
let code = require('../utils/code');
let config = require('../utils/config');
let sql = require('../utils/sql');

let login = {

    /**
     * 用于前端登陆接口
     * @param req
     * @param res
     */
    login: function (req, res) {
        this.verify(req, res, true);
    },

    /**
     * 登陆校验接口
     * @param req
     * @param res
     * @param isLoginReq
     */
    verify: function (req, res, isLoginReq) {
        let recv = req.body;
        let accountid = recv.account_id;
        let password = recv.password;
        let platform = recv.platform;
        let channel = recv.channel;
        let serverid = recv.server_id;

        if (accountid && password && typeof channel !== "undefined" && typeof platform !== "undefined") {
            let date = new Date();
            console.log("user " + accountid + " channel " + channel + " request login " + date.toLocaleString());
            event.once(code.msg["user_checkin"], (result) => {
                if (result.error) {
                    res.send(result);
                } else {
                    if (!req.session) {
                        req.session = {};
                    }
                    req.session.account_id = result.user.account_id;
                    req.session.password = result.user.password;
                    req.session.recent = result.user.servers;
                    let resp = {error: result.error};
                    if (isLoginReq) {
                        let servers = result.user.servers;
                        resp.recent = servers ? servers.split(',') : null;
                        resp.all = config.getServerList(result.user.state);
                        this._updateLoginInfo(result.user);
                    } else {
                        req.session.server_id = serverid;
                        req.session.recent = result.user.servers;
                        this._updateLoginInfo(result.user, serverid);
                    }
                    res.send(resp);
                }
            });

            this._checkUser(accountid, password, channel, platform);
        }
        else {
            res.status(400).end();
        }
    },

    /**
     * 判断是否已经登陆
     * @private
     */
    _checkLogin: function (req, isLoginReq) {
        try {
            let accountId = req.session.account_id;
            if (accountId && accountId === req.body.account_id) {
                if (isLoginReq) {
                    if (req.session.password === req.body.password) {
                        return true;
                    }
                } else {
                    let server_id = req.session.server_id;
                    if (server_id === req.body.server_id) {
                        return true;
                    }
                }
            }
        } catch (error) {
            return false;
        }
        return false;
    },

    /**
     * 判断用户登陆信息是否正确
     * @param account_id
     * @param password
     * @param channel
     * @private
     */
    _checkUser: function (account_id, password, channel, platform) {
        const sqlStr = "select * from account where account_id='" + account_id + "' and channel=" + channel;
        sql.query(sqlStr, (error, vals, fields) => {
            let result = {error: 1};
            if (error) {
                result.msg = error.message;
            } else {
                if (vals && vals.length > 0 && password === vals[0].password && vals[0].state > 0) {//判断用户名密码和状态是否被封号
                    result.error = 0;
                    result.user = vals[0];
                    event.emit(code.msg["user_checkin"], result);
                } else {//密码不对或者用户不存在
                    result.msg = code.error.invalid_password;
                    event.emit(code.msg["user_checkin"], result);
                }
            }
        });
    },

    /**
     * 更新玩家登陆信息
     * @param user
     * @param server_id
     * @private
     */
    _updateLoginInfo: function (user, server_id) {
        let sets = ["`update_time`=NOW()"];
        let vals = [];
        if (server_id !== undefined && server_id !== null) {
            let servers = user.servers ? user.servers.split(",") : [];

            for (let i = 0; i < servers.length; i++) {
                if (parseInt(server_id) === parseInt(servers[i])) {
                    servers.splice(i, 1);
                    break;
                }
            }

            servers.unshift(server_id);
            user.servers = servers.toString();
            sets.push("`servers`=?");
            vals.push(servers.toString());
        }
        vals.push(user.id);
        sql.query({
            sql: "UPDATE `account` SET " + sets.join(",") + " WHERE `id`=?",
            values: vals,
        }, (error, vals, fields) => {
            let result = {error: 1};
            if (error) {
                result.msg = error.message;
            }
        });
    }
};

module.exports = login;