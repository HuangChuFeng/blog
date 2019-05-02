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
    email: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    source: { type: 'string' },
    avatar: { type: 'string' },
    type: {type: 'number'} // 1 管理员, 0 普通用户
});
exports.User.index({ email: 1, _id: -1 }).exec(); // 根据用户名找到用户，用户名全局唯一

// 文章模型
exports.Article = mongolass.model('Article', {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: 'string' },
    content: { type: 'string' },
    type: { type: 'number' },
    cover_url: { type: 'string' },
    category_id: { type: 'string' },
    description: { type: 'string' },
    content: { type: 'string' },
    browse_num: { type: 'number', default: 0 },
    created_at: { type: 'string' },
});
exports.Article.index({ author: 1, _id: -1 }).exec();   // 按创建时间降序查看用户的文章列表

// 文章标签模型
exports.ArticleTag = mongolass.model('ArticleTag', {
    name: { type: 'string' },
    article_id: { type: Mongolass.Types.ObjectId },
});
exports.ArticleTag.index({ name: 1 }).exec();

// 评论模型
exports.Comment = mongolass.model('Comment', {
    sender: { type: Mongolass.Types.ObjectId },
    receiver: { type: Mongolass.Types.ObjectId },
    senderInfo: { type: 'string' },
    target: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    created_at: { type: 'string' },
});
exports.Comment.index({ user: 1, _id: -1 }).exec();

// 照片模型
exports.Img = mongolass.model('Img', {
    group_id: { type: 'object', ref: 'ImgsGroup' },
    src: { type: 'string' },
    favor_count: { type: 'number', default: 0 },
    h: { type: 'number' },
    w: { type: 'number' },
});
exports.Img.index({ _id: 1 }).exec(); // 按创建时间降序查看用户的照片列表

// 照片组模型
exports.ImgsGroup = mongolass.model('ImgsGroup', {
    // imgs_group_id: { type: Mongolass.Types.ObjectId },
    location: { type: 'string' },
    title: { type: 'string' },
    created_at: { type: 'string' },
    category: { type: 'string' },
});
exports.ImgsGroup.index({ _id: 1}).exec();    // 按创建时间降序查看用户的照片列表