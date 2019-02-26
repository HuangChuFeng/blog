const Article = require('../lib/mongo').Article;
module.exports = {
    // 获取所有文章
    getArticles: function getArticles(author) {
        var query = {};
        if (author) {
            query.author = author;
        }
        return Article
        .find(query)
        // .populate({ path: 'author', model: 'User' })
        .addCreatedAt()
        .sort({ _id: -1 })
        .exec();
    },
    // 创建文章
    create: function create(article) {
        article.browse_num = 0;
        return Article.create(article).exec();
    }
}