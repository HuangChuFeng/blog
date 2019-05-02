const ArticleTag = require("../models/ArticleTag");
const AritcleModel = require("../models/article");
const CommentModel = require("../models/Comment");

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
            let obj = {};
            var tags = await ArticleTag.getTags();
            tags = tags.reduce((cur,next) => {
                obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
                return cur;
            },[])
        } catch (e) {
            resCode = 500;
            message = "服务器出错了";
            console.log(e);
            
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

    // 根据标签获取对应文章
    "GET /api/tag/articles": async ctx => {
        const { tag } = ctx.request.query;
        console.log('tag', tag);
        
        let resCode = 200,
            message = "ok";
        try {
            var articles = [];
            var articlesIds = await ArticleTag.getArticleByTagName(tag);
            for(let i = 0; i < articlesIds.length; i++) {
                let item = await AritcleModel.getArticleById(articlesIds[i].article_id);
                articles.push(item[0])
            }
            for(let j = 0; j < articles.length; j++) {
                articles[j].comments = await CommentModel.getCommentsCount(articles[j]._id);
            }
        } catch (e) {
            resCode = 500;
            message = "添加失败";
        }
        ctx.response.body = {
            resCode,
            message,
            articles
        };
    },
}