const moment = require('moment');
const Img = require('../lib/mongo').Img;
const ImgsGroup = require('../lib/mongo').ImgsGroup;
const CommentModel = require("./Comment");

// 操作数据库
module.exports = {
  // 获取所有照片
  getImgsByGroupId: function getImgsByGroupId(groupId) {
    var query = {}; //, skip = 0, limit = 3;
    if (groupId) {
      query.group_id = groupId;
    }
    // skip = (pageNum - 1) * limit
    return Img
      .find(query)
      // .limit(limit)åååßß
      // .skip(skip)
      .exec();
  },

  // 根据group_id获取一组照片
  getGroups: function getGroups(category) {
    var query = {};
    if (category) {
      query.category = category;
    }
    return ImgsGroup.find(query).sort({ _id: -1 }).exec();
  },

  // 按照id根据某张照片详情
  getImgById: function getImgById(id) {
    var query = {};
    if (id) {
      query._id = id;
    }
    return Img
      .find(query)
      .populate({ path: 'group_id', model: 'ImgsGroup' })
      .exec()
  },

  /**
   *  上一篇或下一篇
   *  curId: 当前文章id
   *  typeNum: -1表示上一篇, 1表示下一篇
   **/
  getLastOrNextImg: function getLastOrNextImg(curId, typeNum) {
    var query = {};
    if (curId) {
      query = typeNum === '1' ? { '_id': { '$lt': curId } } : { '_id': { '$gt': curId } };
    }
    return Img
      .find(query)
      .populate({ path: 'group_id', model: 'ImgsGroup' })
      .sort({ _id: -1 })
      .limit(1)
      .exec();
  },

  // 删除文章
  delImgById: function delImgById(id) {
    return Img.remove({ _id: id })
      .exec()
      .then(function (res) {
        // 文章删除后，再删除该文章下的所有留言和标签
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsById(id);
        }
      });
  },


  // 更新照片浏览量
  addImgPv: function addImgPv(imgId) {
    return Img.update({ _id: imgId }, { $inc: { pv: 1 } }).exec();
  },


  // 更新照片喜欢数量
  addImgFavor: function addImgFavor(imgId) {
    return Img.update({ _id: imgId }, { $inc: { favor_count: 1 } }).exec();
  },

  // 创建照片组
  createImgGroup: function createImgGroup(info) {
    info.created_at = moment().format('YYYY-MM-DD HH:mm');
    return ImgsGroup.create(info).exec()
  },

  // 插入每张照片
  createImgs: function createImgs(img) {
    return Img.create(img).exec()
  },
}