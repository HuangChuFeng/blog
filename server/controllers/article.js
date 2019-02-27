const AritcleModel = require("../models/article");
module.exports = {
    // 获取所有文章
    "GET /api/articles": async ctx => {
        console.log('session==========', ctx.session);

        let resCode = 200,
            message;
        try {
            var articles = await AritcleModel.getArticles();
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

    // 创建新文章
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

    // GET /posts/:postId/remove 删除一篇文章
    "GET /api/articles/:articleId/remove": async ctx => {
        let { articleId } = ctx.params,
            // author = ctx.session.user._id,
            resCode = 200,
            message = "删除成功";
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            await AritcleModel.delArticleById(articleId);
        } catch (e) {
            console.log(e);
            message = "删除失败";
            resCode = 500;
        }
        ctx.response.body = {
            resCode,
            message
        };
    },
}