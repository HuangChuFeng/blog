const moment = require('moment');
const ArticleComment = require('../lib/mongo').ArticleComment;
const User = require('../lib/mongo').User;
module.exports = {

    // 创建评论
    create: function create(comment) {
        comment.created_at = moment().format('YYYY-MM-DD HH:mm');
        return ArticleComment.create(comment).exec();
    },

    // 根据文章id获取所有评论
    getComments: function getComments(articleId) {
        return ArticleComment
        .find({ articleId: articleId })
        .populate({ path: 'user', model: 'User' })
        .sort({ _id: 1 })
        .exec();
    },

    // 通过文章 id 获取该文章下留言数
    getCommentsCount: function getCommentsCount(articleId) {
        return ArticleComment.count({ articleId: articleId }).exec();
    }
}