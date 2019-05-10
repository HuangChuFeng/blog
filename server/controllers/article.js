const AritcleModel = require("../models/article");
const ArticleTagModel = require("../models/ArticleTag");
const CommentModel = require("../models/Comment");
const authCheck = require("../middlewares/check").auth;
const path = require("path");
const fs = require('fs');
const { deleteFolder, domain } = require('./util')

module.exports = {
    // 获取所有文章
    "GET /api/articles": async ctx => {
        const { type, pageNum } = ctx.request.query;
        const pageSize = 10;
        let resCode = 200,
            message;
        try {
            var articles = await AritcleModel.getArticles(type, pageNum);

            for (let i = 0; i < articles.length; i++) {
                articles[i].comments = await CommentModel.getCommentsCount(articles[i]._id);
            }
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
            typeNum = ctx.request.query.typeNum;
        let resCode = 200,
            message = 'ok',
            noMore = false;
        try {
            var article = [], comment = [], tags = [];
            // 按照当前文章id获取上一篇或下一篇
            if (typeNum) {
                article = await AritcleModel.getLastOrNextArticle(articleId, typeNum);
                if (article.length === 0) {
                    noMore = true;
                } else {
                    noMore = false;
                    comment = await CommentModel.getComments(article[0]._id);
                    tags = await ArticleTagModel.getTagByArticleId(article[0]._id);  // 获取该文章所有标签
                }
            } else {
                // 按照id获取文章
                let result = await Promise.all([
                    AritcleModel.getArticleById(articleId),
                    CommentModel.getComments(articleId), // 获取该文章所有评论
                    ArticleTagModel.getTagByArticleId(articleId)  // 获取该文章所有标签
                ]);

                article = result[0];
                comment = result[1];
                tags = result[2]
                if (result[0].length === 0) {
                    noMore = true;
                } else {
                    noMore = false;
                }
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
            comment,
            tags,
            noMore
        };
    },

    // 创建新文章
    "POST /api/articles/create": async ctx => {
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        const { article } = ctx.request.body;
        article.author = ctx.session.user._id;
        let resCode = 200,
            message = "发表成功";
        try {
            // 处理文章封面
            if(article.coverName !== '') {
                let oldPath = path.resolve(__dirname, '../build/tempFolder/' + article.coverName);
                let newPath = path.resolve(__dirname, '../build/upload/cover/' + article.coverName);
                fs.renameSync(oldPath, newPath);
                article.cover_url = domain + 'upload/cover/' + article.coverName;
            }
            await AritcleModel.create(article);
            // 删除临时目录下的所有图片
            let tempPath = path.resolve(__dirname, '../build/tempFolder');
            deleteFolder(tempPath);
        } catch (e) {
            resCode = 500;
            message = "发表失败";
            console.log(e);
        }
        ctx.response.body = {
            resCode,
            message,
        };
    },

    // GET /posts/:postId/remove 删除一篇文章
    "GET /api/articles/:articleId/remove": async ctx => {
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        
        let { articleId } = ctx.params,
            coverName = ctx.request.query.coverName,
            resCode = 200,
            message = "删除成功";
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            await AritcleModel.delArticleById(articleId);
            // 删除对应封面
            let tempPath = path.resolve(__dirname, '../build/upload/cover/' + coverName);
            fs.unlink(tempPath)
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
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        let { articleId } = ctx.params,
            { article } = ctx.request.body,
            // author = ctx.session.user._id,
            resCode = 200,
            message = "更新成功";
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            // 处理文章封面
            if(article.coverName !== '') {
                let oldPath = path.resolve(__dirname, '../build/tempFolder/' + article.coverName);
                let newPath = path.resolve(__dirname, '../build/upload/cover/' + article.coverName);
                fs.renameSync(oldPath, newPath);
                article.cover_url = domain + 'upload/cover/' + article.coverName;
            }
            await AritcleModel.updateArticleById(articleId, article);
            // 删除临时目录下的所有图片
            let tempPath = path.resolve(__dirname, '../build/tempFolder');
            deleteFolder(tempPath);
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

    // 更新文章浏览量
    "GET /api/articles/:articleId/addArticlePv": async ctx => {
        let { articleId } = ctx.params,
            // author = ctx.session.user._id,
            resCode = 200,
            message = "更新成功";
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            await AritcleModel.addArticlePv(articleId);
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