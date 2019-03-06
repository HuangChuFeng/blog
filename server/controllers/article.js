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
    // 按照id获取单个文章 // 上一篇or下一篇
    "GET /api/articles/:articleId": async ctx => {
        const { articleId } = ctx.params,
            typeNum =  ctx.request.query.typeNum;
        let resCode = 200,
            message = 'ok';
        try {
            var article = [];
            if(typeNum !== 'undefined') {
                article = await AritcleModel.getLastOrNextArticle(articleId, typeNum);
                console.log('=====', article);
            } else {
                article = await AritcleModel.getArticleById(articleId);
                
            }
        } catch (e) {
            resCode = 500;
            console.log(e);
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            article,
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

    // GET /posts/:postId/update 更新文章
    "POST /api/articles/:articleId/update": async ctx => {
        let { articleId } = ctx.params,
            { article } = ctx.request.body,
            // author = ctx.session.user._id,
            resCode = 200,
            message = "更新成功";
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            await AritcleModel.updateArticleById(articleId, article);
        } catch (e) {
            console.log(e);
            message = "更新失败";
            resCode = 500;
        }
        ctx.response.body = {
            resCode,
            message,
        };
    },
}