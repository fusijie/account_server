/**
 * Created by Jacky on 2017/10/25.
 */
let event = require('../utils/event');
let sql = require('../utils/sql');
let code = require('../utils/code');

let register = {

    /**
     * 用于前端注册接口
     * @param req
     * @param res
     */
    register: function (req, res) {
        console.log("request register: ", req.body);
        let recv = req.body;
        let accountid = recv.account_id;
        let password = recv.password;
        let platform = recv.platform;
        let channel = recv.channel;

        if (accountid && password && typeof channel !== "undefined") {
            event.once(code.msg["user_check_exist"], (result) => {
                if (!result.error) {
                    if (result.user.length <= 0) {
                        event.once(code.msg["user_register"], (result) => {
                            res.send(result);
                        });
                        this._queryRegister(accountid, password, channel, platform);
                    } else {
                        result.error = code.error.user_exist;
                        delete result.user;
                        res.send(result);
                    }
                } else {
                    res.send(result);
                }
            });

            this._queryHasUser(accountid, channel, platform);
        }
    },

    /**
     * 用于前端判断用户名是否存在
     * @param req
     * @param res
     */
    checkUserExist: function (req, res) {
        let recv = req.query;
        let platform = recv.platform;
        let channel = recv.channel;
        let accountid = recv.account_id;
        if (typeof accountid !== "undefined" && typeof channel !== "undefined" && typeof platform !== "undefined") {
            event.once(code.msg["user_check_exist"], (result) => {
                if (!result.error && result.user && result.user.length > 0) {
                    res.send({error:code.error.user_exist});
                } else {
                    res.send({error: 0});
                }
            });
            this._queryHasUser();
        }
    },

    /**
     * 注册,写入数据库
     * @param uid
     * @param password
     * @param channel
     * @param platform
     */
    _queryRegister: function (uid, password, channel, platform) {
        const sqlStr = "insert into account (account_id,password,channel,platform,create_time) value ('" + uid + "','" + password + "'," + channel + ",'" + platform + "',NOW())";
        sql.query(sqlStr, (error, vals, fields) => {
            let result = {error: 1};
            if (error) {
                result.msg = error.message;
            } else {
                result.error = 0;
            }
            event.emit(code.msg["user_register"], result);
        });
    },

    /**
     * 判断用户是否存在,存在提示错误~
     * @param accountid
     * @param channel
     * @param platform
     * @private
     */
    _queryHasUser: function (accountid, channel, platform) {
        const sqlStr = "select * from account where account_id='" + accountid + "' and channel=" + channel;
        sql.query(sqlStr, (error, vals, fields) => {
            let result = {error: 1};
            if (error || !vals) {
                result.msg = error.message;
            } else {
                result.error = 0;
                result.user = vals;
            }
            event.emit(code.msg["user_check_exist"], result);
        });
    }
};

module.exports = register;