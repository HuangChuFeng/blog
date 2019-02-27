const moment = require('moment');
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
        // .addCreatedAt()
        .sort({ _id: -1 })
        .exec();
    },

    // 创建文章
    create: function create(article) {
        article.browse_num = 0;
        article.created_at = moment().format('YYYY-MM-DD HH:mm');
        return Article.create(article).exec();
    },

    // 删除文章
    delArticleById: function delArticleById(id) {
        return Article.remove({ _id: id })
          .exec()
        //   .then(function (res) {
        //     // 文章删除后，再删除该文章下的所有留言
        //     if (res.result.ok && res.result.n > 0) {
        //       return CommentModel.delCommentsByPostId(postId);
        //     }
        // });
    }
}