const AritcleModel = require("../models/article");
const ArticleTagModel = require("../models/articleTag");
const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const authCheck = require("../middlewares/check").auth;
const path = require("path");
const fs = require('fs');
const { deleteFolder, domain, transporter } = require('./util')

module.exports = {
    // 获取所有文章
    "GET /api/articles": async ctx => {
        const { type, pageNum, pageSize } = ctx.request.query;
        let resCode = 200,
            message,
            allCount = 0;
        try {
            var articles = await AritcleModel.getArticles(type, pageNum, Number(pageSize));

            for (let i = 0; i < articles.length; i++) {
                delete articles[i].content;
                delete articles[i].type;
                delete articles[i].author;
                delete articles[i].likes;
                articles[i].cover_url && (articles[i].cover_url = articles[i].cover_url.replace(/:3000/, ''))
                articles[i].comments = await CommentModel.getCommentsCount(articles[i]._id);
            }
            allCount = await AritcleModel.getArticleCount(type)
        } catch (e) {
            console.log(e);
            resCode = 500;
            message = e;
        }

        ctx.response.body = {
            resCode,
            message,
            articles,
            allCount
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

            // 判断评论接收者是不是当前用户
            comment.forEach(item => {
                item.isReceiver = false
                if(ctx.session.user && item.receiver + '' ===  ctx.session.user._id) {
                    item.isReceiver = true
                }
                item.child.forEach(item1 => {
                    item1.isReceiver = false
                    if(ctx.session.user && item1.receiver + '' ===  ctx.session.user._id) {
                        item1.isReceiver = true
                    }
                })
            })
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

    // 更新文章喜欢数量
    "GET /api/articles/:articleId/addArticleFavor": async ctx => {
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        let { articleId } = ctx.params,
            userId = ctx.session.user._id,
            resCode = 200,
            message = "更新成功",
            type = 0;
        try {
            if (!articleId) {
                throw new Error("文章不存在");
            }
            let userInfo = await UserModel.getUserById(userId);
            if(userInfo.likes.indexOf(articleId) === -1) {
                type = 1;
            }
            await AritcleModel.addArticleFavor(articleId, type);
            await UserModel.updateLikes(articleId, userId, type);
            if(type === 1) {
                // 发送邮件通知
                var countOptions = {
                    from: '"____cranky 👻" <1378894282@qq.com>',
                    to: 'chufeng_huang@163.com',
                    subject: '文章喜爱',
                    text: `一封来自"____就算减不下去也要继续减肥的可能被摄影耽误的程序员网站"的邮件`,
                    html: `<p>来自${ctx.session.user.source}的${ctx.session.user.name}喜欢了你的文章:<a href="http://www.huangchufeng.site/articles/detail/${articleId}">点击查看详情</a></p>`,
                }; 
                transporter().sendMail(countOptions, function(err, msg){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('发送邮件成功: ', `www.huangchufeng.site/articles/detail/${articleId}`);
                    }
                });
            }
        } catch (e) {
            console.log(e);
            message = "更新失败";
            resCode = 500;
        }
        ctx.response.body = {
            resCode,
            message,
            type
        };
    },
}