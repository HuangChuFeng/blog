const UserModel = require("../models/user");
const authCheck = require("../middlewares/check").auth;

module.exports = {
    "POST /api/user/login": async ctx => {
		let resCode = 200,
			message = '登录成功',
			{ name, password } = ctx.request.body,
			user;
		try {
			user = await UserModel.getUserByName(name);
			console.log('user====', user);
			if (user && password == user.password) {
				delete user.password;
				ctx.session.user = user;
				console.log('登录, session*******', ctx.session);
			} else {
				resCode = 500;
				message = '用户名或密码错误';
			}
		} catch (e) {
			resCode = 500;
			message = "服务器出错了";
		}
		ctx.response.body = {
			resCode,
			message,
			user
		};
    },
    "POST /api/user/register": async ctx => {
		let resCode = 200,
			message = '注册成功',
            user = ctx.request.body;
            delete user.password;
            ctx.session.user = user;
        try {
            var result = await UserModel.create(user),
                res = result.ops[0];
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
}