const ArticleTag = require('../lib/mongo').ArticleTag;
module.exports = {

    // 创建标签
    create: function create(tag) {
        return ArticleTag.create(tag).exec();
    },

    // 获取所有标签
    getTags: function getTags() {
        return ArticleTag
        .find({})
        .sort({ _id: -1 })
        .exec();
    },

    // 根据文章id获取所有标签
    getTagByArticleId: function getTagByArticleId(articleId) {
        return ArticleTag
        .find({ article_id: articleId })
        .exec();
    },

    // 删除标签
    delTagById: function delTagById(tagId) {
        return ArticleTag.remove({ _id: tagId })
        .exec()
    }
}