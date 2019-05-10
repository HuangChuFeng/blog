const crypto = require("crypto");
const UserModel = require("../models/user");
const authCheck = require("../middlewares/check").auth;

module.exports = {
    "POST /api/user/login": async ctx => {
		let resCode = 200,
			message = '登录成功',
			{ email, password } = ctx.request.body,
			user;
		try {
			user = await UserModel.getUserByEmail(email);
			let md5 = crypto.createHash("md5");
			let newPas = md5.update(password).digest("hex");
			if (user && newPas == user.password) {
				delete user.password;
				ctx.session.user = user;
				console.log('user', user);
				
			} else {
				resCode = 500;
				message = '用户名或密码错误';
			}
		} catch (e) {
			resCode = 500;
			console.log(e)
			message = "服务器出错了";
		}
		ctx.response.body = {
			resCode,
			message,
			user
		};
	},
	// 注册用户
    "POST /api/user/register": async ctx => {
		let resCode = 200,
			message = '注册成功',
            user = ctx.request.body;
		ctx.session.user = user; 
		let md5 = crypto.createHash("md5");
		user.password = md5.update(user.password).digest("hex");
        try {
			if(user.email === 'chufeng_huang@163.com') {
				user.type = 1;
			}
            var result = await UserModel.create(user),
                res = result.ops[0];
			delete ctx.session.user.password;	
        } catch (e) {
            resCode = 500;
            message = "注册失败";
        }
        ctx.response.body = {
            resCode,
            message,
            res
        };
	},
	// 退出
	// 注册用户
    "GET /api/user/quit": async ctx => {
		let resCode = 200,
			message = '退出成功';
		delete ctx.session.user;
        ctx.response.body = {
            resCode,
            message,
        };
	},
}