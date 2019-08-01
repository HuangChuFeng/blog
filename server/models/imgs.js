const moment = require('moment');
const Img = require('../lib/mongo').Img;
const ImgsGroup = require('../lib/mongo').ImgsGroup;
const CommentModel = require("./comment");

// 操作数据库
module.exports = {
  // 获取所有照片
  getImgsByGroupId: function getImgsByGroupId(groupId, isGetFirst) {
    var query = {};
    if (groupId) {
      query.group_id = groupId;
    }
    if(isGetFirst) {
      return Img
        .findOne(query)
        .exec();
    } else {
      return Img
        .find(query)
        .sort({ created_at: -1 })
        .exec();
    }
  },

  // 根据group_id获取一组照片
  getGroupImgs: function getGroupImgs(group_id) {
    var query = {};
    if (group_id) {
      query._id = group_id;
    }
    return ImgsGroup
      .find(query)
      // .populate({ path: '_id', model: 'Img' })
      .sort({ created_at: -1 })
      .exec();
  },

  // 删除组图 by id
  delGroupById: function delGroupById(id) {
    return ImgsGroup.remove({ _id: id }).exec();
  },

  // 获取所有组图信息
  getGroups: function getGroups(category, pageNum, pageSize) {
    var query = {}, skip = 0, limit = pageSize; // limit 一次获取3个组图图片
    if (category) {
      query.category = category;
    }
    skip = (pageNum - 1) * limit
    return ImgsGroup
    .find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
  },

  // 通过类型获取所有组图数量
  getGroupCount: function getGroupCount(category) {
    let query = category ? { category: category } : {}
    return ImgsGroup.count(query).exec();
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
   *  上一张或下一张
   *  curId: 当前图片id
   *  typeNum: -1表示上一张, 1表示下一张
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

  // 删除
  delImgById: function delImgById(id) {
    return Img.remove({ _id: id })
      .exec()
      .then(function (res) {
        // 照片删除后，再删除该照片下的所有留言
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsById(id);
        }
      });
  },


  // 更新照片浏览量
  addImgPv: function addImgPv(imgId) {
    return Img.update({ _id: imgId }, { $inc: { pv: 1 } }).exec();
  },

  /** 
   * 更新照片喜欢数量
   * @type 0 删除, 1 增加
   **/
  addImgFavor: function addImgFavor(imgId, type) {
    if(type === 0) {
      return Img.update({ _id: imgId }, { $inc: { likes: -1 } }).exec();
    }
    return Img.update({ _id: imgId }, { $inc: { likes: 1 } }).exec();
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