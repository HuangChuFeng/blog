const Article = require('../lib/mongo').Article;
module.exports = {
    // 获取所有文章
    getArticles: function getArticles(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Post
        .find(query)
        .populate({ path: 'author', model: 'User' })
        .sort({ _id: -1 })
        .addCreatedAt()
        .exec();
    },
    // 创建文章
    create: function create(article) {
        return Article.create(article).exec();
    }
}