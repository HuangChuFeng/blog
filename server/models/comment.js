const moment = require('moment');
const Comment = require('../lib/mongo').Comment;
const User = require('../lib/mongo').User;
module.exports = {

    // 创建评论
    create: function create(comment) {
        comment.created_at = moment().format('YYYY-MM-DD HH:mm');
        return Comment.create(comment).exec();
    },

    // 根据文章或照片id获取所有评论
    getComments: function getComments(target) {
        return Comment
        .find({ target: target })
        .sort({ _id: 1 })
        .exec();
    },

    // 删除某篇文章或某张照片下的所有评论
    delCommentsById: function delCommentsById(target) {
        return Comment.remove({ target: target })
          .exec();
    },

    // 通过id 获取留言数
    getCommentsCount: function getCommentsCount(target) {
        return Comment.count({ target: target }).exec();
    }
}