let ajax = require('ajax');
let md5 = require('md5');

cc.Class({
    extends: cc.Component,

    properties: {
        register_acc: cc.EditBox,
        register_pwd: cc.EditBox,
        register_channel: cc.EditBox,

        login_acc: cc.EditBox,
        login_pwd: cc.EditBox,
        login_channel: cc.EditBox,

        label_log: cc.Label
    },

    // use this for initialization
    onLoad: function () {
    },

    on_click_register: function () {
        ajax.postJSON('http://127.0.0.1:7000/register', {
            account_id: this.register_acc.string,
            password: md5(this.register_pwd.string),
            channel: this.register_channel.string,
            platform: cc.sys.platform
        }, (err, data) => {
            if (!err) {
                this.label_log.string = JSON.stringify(data);
            }else {
                this.label_log.string = "请求出错";
            }
        });
    },

    on_click_login: function () {
        ajax.postJSON('http://127.0.0.1:7000/login', {
            account_id: this.login_acc.string,
            password: md5(this.login_pwd.string),
            channel: this.login_channel.string,
            platform: cc.sys.platform
        }, (err, data) => {
            if (!err) {
                this.label_log.string = JSON.stringify(data);
            }else {
                this.label_log.string = "请求出错";
            }
        });
    },

    on_click_get_announcement: function () {
        ajax.postJSON('http://127.0.0.1:7000/announcement', {

        }, (err, data) => {
            if (!err) {
                this.label_log.string = JSON.stringify(data);
            }else {
                this.label_log.string = "请求出错";
            }
        });
    }

});
