const moment = require('moment');
const Comment = require('../lib/mongo').Comment;
const User = require('../lib/mongo').User;
const Mongolass = require('mongolass');
module.exports = {

    // 创建评论
    create: function create(comment) {
        console.log('comment', comment);
        comment.created_at = moment().format('YYYY-MM-DD HH:mm');
        return Comment.create(comment).exec();
    },

    // 根据文章或照片id获取所有评论
    getComments: function getComments(target) {
        return Comment
        .find({ target: target })
        .sort({ created_at: -1 })
        .exec()
        .then(res => {
            let newComments = res.filter(item => {
                return !item.belongId
            }).map(item => {
                return {
                    ...item,
                    child: []
                }
            });
            res.forEach(item => {
                if(item.belongId) {
                    newComments.forEach(item1 => {
                        if('' + item1._id === item.belongId) {
                            item1.child.push(item)
                        }
                    })
                }
            })
            return newComments;
        });
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