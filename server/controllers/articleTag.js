const ArticleTag = require("../models/ArticleTag");

module.exports = {
    // 增加新标签
    "POST /api/articleTags/create": async ctx => {
        const tag = ctx.request.body;
        let resCode = 200,
            message = "ok";
        try {
            var result = await ArticleTag.create(tag),
                res = result.ops[0];
        } catch (e) {
            console.log(e);
            resCode = 500;
            message = "添加失败";
        }
        ctx.response.body = {
            resCode,
            message,
            res
        };
    },

    // 获取所有标签
    "GET /api/articleTags": async ctx => {
        let resCode = 200,
            message;
        try {
            var tags = await ArticleTag.getTags();
            
        } catch (e) {
            resCode = 500;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            tags,
        };
    },

    // 按照文章id获取所有标签
    "GET /api/articleTags/:articleId": async ctx => {
        const { articleId } = ctx.params;
        let resCode = 200,
            message;
        try {
            var tags = await ArticleTag.getTags(articleId);
        } catch (e) {
            resCode = 500;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            tags,
        };
    },

    // 删除标签
    "GET /api/articleTags/:tagId/remove": async ctx => {
        let { tagId } = ctx.params,
            resCode = 200,
            message = "删除成功";
        try {
            if (!tagId) {
                throw new Error("标签不存在");
            }
            await ArticleTag.delTagById(tagId);
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