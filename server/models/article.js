const moment = require('moment');
const Article = require('../lib/mongo').Article;
const ArticleTagModel = require("./ArticleTag");
const CommentModel = require("./Comment");
module.exports = {
    // 获取所有文章
    getArticles: function getArticles(type, pageNum, author) {
        var query = {}, skip = 0, limit = 10;
        if (author) {
            query.author = author;
        }
        if(type !== 'undefined') {
            query.type = Number(type)
        }
        skip = (pageNum - 1) * limit
        return Article
        .find(query)
        // .populate({ path: 'author', model: 'User' })
        .sort({ _id: -1 })
        .limit(limit)
        .skip(skip)
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
            // console.log(typeNum === '1' ? '下一篇' : '上一篇')
            query = typeNum === '1' ? { '_id': { '$lt': curId }} : { '_id': { '$gt': curId }} ;
        }
        return Article
        .find(query)
        .sort({_id: -1})
        .limit(1)
        .exec();
    },

    // 更新文章浏览量
    addArticlePv: function addArticlePv(articleId) {
        return Article.update({ _id: articleId }, { $inc:{ pv: 1 }}).exec();
    },

    // 创建文章
    create: function create(article) {
        article.created_at = moment().format('YYYY-MM-DD HH:mm');
        let tags = article.tags;
        return Article.create(article)
            .exec()
            .then(function(res) {
                // 关联文章标签
                if (res.result.ok && res.result.n > 0) {
                    let articleId = res.ops[0]._id;
                    return Promise.all(tags.map(tag => {
                        return ArticleTagModel.connectAritcle(articleId, tag);
                    }))
                  }
            })
    },

    // 删除文章
    delArticleById: function delArticleById(id) {
        return Article.remove({ _id: id })
          .exec()
          .then(function (res) {
            // 文章删除后，再删除该文章下的所有留言和标签
            if (res.result.ok && res.result.n > 0) {
              return Promise.all([
                CommentModel.delCommentsById(id),
                ArticleTagModel.delTagsByArticleId(id)
              ])
            }
        });
    },

    // 编辑文章
    updateArticleById: function updateArticleById(id, data) {
        let tags = data.tags;
        return Article.update({ _id: id }, { $set: data })
        .exec()
        .then(function (res) {
            // 文章更新后，再更新该文章下的所有标签
            if (res.result.ok && res.result.n > 0) {
              return Promise.all([
                ArticleTagModel.delTagsByArticleId(id),
                ...tags.map(tag => {
                    return ArticleTagModel.connectAritcle(id, tag);
                })
              ])
            }
        });
    }
}