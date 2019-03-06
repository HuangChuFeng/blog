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

    // 按id获取单个文章
    getArticleById: function getArticleById(id) {
        var query = {};
        if (id) {
            query._id = id;
        }
        return Article
        .find(query)
        .exec();
    },

    /**
     *  上一篇或下一篇
     *  curId: 当前文章id
     *  typeNum: -1表示上一篇, 1表示下一篇
     **/
    getLastOrNextArticle: function getLastOrNextArticle(curId, typeNum) {
        var query = {};
        if (curId) {
            console.log(typeNum === '1' ? '下一篇' : '上一篇')
            query = typeNum === '1' ? { '_id': { '$lt': curId }} : { '_id': { '$gt': curId }} ;
        }
        return Article
        .find(query)
        .sort({_id: -1})
        .limit(1)
        .exec();
    },

    // 创建文章
    create: function create(article) {
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
    },

    // 编辑文章
    updateArticleById: function updateArticleById(id, data) {
        return Article.update({ _id: id }, { $set: data }).exec();
    }
}