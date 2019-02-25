const AritcleModel = require("../models/article");
module.exports = {
    "GET /api/articles": async ctx => {
        let resCode = 200,
            message;
        try {
            var articles = await AritcleModel.getAritcleModel();
        } catch (e) {
            resCode = 500;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            articles,
        };
    },
    "POST /api/articles/create": async ctx => {
        const { article } = ctx.request.body;
        let resCode = 200,
            message = "成功发表";
        try {
            var result = await AritcleModel.create(article),
                res = result.ops[0];
            
        } catch (e) {
            resCode = 500;
            message = "发表失败";
        }
        ctx.response.body = {
            resCode,
            message,
            res
        };
    },
}