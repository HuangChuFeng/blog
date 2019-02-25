const config = require('config-lite');
const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});
//用户模型
exports.User = mongolass.model('User', {
    account: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
});

exports.User.index({ account: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

exports.Article = mongolass.model('Article', {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: 'string' },
    content: { type: 'string' },
    type: { type: 'string' },
    cover_url: { type: 'string' },
    tags: { type: 'string' },
    category_id: { type: 'string' },
    description: { type: 'string' },
    publish_time: { type: 'string' },
    content: { type: 'string' },
    browse_num: { type: 'number'},
});

exports.Article.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表


exports.Img = mongolass.model('Img', {
    id: { type: Mongolass.Types.ObjectId },
    src: { type: 'string' },
    favor_count: { type: 'number' },
});

exports.Img.index({ id: 1}, { unique: true }).exec();// 按创建时间降序查看用户的文章列表