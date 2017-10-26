/**
 * Created by Jacky on 2017/10/25.
 */

let code = {};

code.error = {
    user_exist: 1,
    invalid_password: 2
};

code.msg = {};

let msg = [
    "user_check_exist",//判断用户是否存在
    "user_register",//用户注册,
    "user_checkin"//用于登陆和服务端登陆验证
];

for (let i in msg) {
    code.msg[msg[i]] = msg[i];
}

module.exports = code;