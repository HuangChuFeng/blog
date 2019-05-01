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

    // 关联标签和文章
    connectAritcle(article_id, name) {
        return ArticleTag.create({
            article_id,
            name
        }).exec();
    },
    
    // 根据文章id获取所有标签
    getTagByArticleId: function getTagByArticleId(articleId) {
        return ArticleTag
        .find({ article_id: articleId })
        .exec();
    },

    // 根据文章id删除所有标签
    delTagsByArticleId: function delTagsByArticleId(articleId) {
        return ArticleTag.remove({ article_id: articleId })
        .exec()
    },

    // 删除标签
    delTagById: function delTagById(tagId) {
        return ArticleTag.remove({ _id: tagId })
        .exec()
    }
}