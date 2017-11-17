/**
 * Created by Jacky on 2017/10/25.
 */

let express = require("express");
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');

let register = require('./logic/register');
let login = require('./logic/login');
let config = require('./utils/config');

let app = express();

let server = {

    init: function () {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

        app.use(cookieParser());
        app.use(expressSession({
            name: "session",
            secret: '12345',
            cookie: {maxAge: 1000 * 60 * 60},
            resave: true,
            saveUninitialized: true
        }));

        //注册
        app.use("/", (req, res, next) => {

            if (!res.get("Access-Control-Allow-Credentials")) {
                res.header("Access-Control-Allow-Credentials", true);
            }

            //todo: 需要对白名单过滤进行编写
            if (this.check_origin(req.headers.referer)) {
                if (!res.get("Access-Control-Allow-Origin")) {
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                }
            }

            if (req.url === '/favicon.ico') {
                return res.end('');
            }

            //todo:做校验逻辑,做重复攻击防御代码

            let isJSONP = function (req) {
                return req.query && req.query.callback;
            };
            let send_bake = res.send;
            req.body = isJSONP(req) ? req.query : req.body;

            res.send = function (data) {
                if (isJSONP(req)) {
                    send_bake.call(res, `${req.query.callback}(${JSON.stringify(data)})`);
                } else {
                    send_bake.call(res, data);
                }
            };

            next();
        });

        //注册
        app.use('/register', function (req, res) {
            register.register(req, res);
        });
        //验证用户名是否存在
        app.use('/checkUser', function (req, res) {
            register.checkUserExist(req, res);
        });
        //验证用户名是否存在
        app.use('/verify', function (req, res) {
            login.verify(req, res);
        });

        //登陆
        app.use('/login', function (req, res) {
            login.login(req, res);
        });

        //请求公告信息
        app.use("/announcement", function (req, res) {

            let result = {error: 1};
            do {
                let ann_row = config.getAnnouncement();
                if (!ann_row) {
                    break;
                }
                result.error = 0;
                result.id = ann_row.id;
                result.data = ann_row.data;
            } while (false);

            res.send(result);
        });

        return this;
    },

    start: function (port) {
        app.listen(port);
    },

    //todo 正式上线后需要对域名进行过滤
    check_origin: function (referer) {

        return true;

        let white_list = global.config.white_list;
        for (let i in white_list) {
            if (referer.indexOf(white_list[i]) !== -1) {
                return true;
            }
        }
        return false;
    }
};

module.exports = server;
