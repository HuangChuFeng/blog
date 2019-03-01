const moment = require('moment');
const Img = require('../lib/mongo').Img;
const ImgsGroup = require('../lib/mongo').ImgsGroup;

// 操作数据库
module.exports = {
  // 获取所有照片
  getImgsByGroupId: function getImgsByGroupId(groupId) {
      var query = {};
        if (groupId) {
            query.group_id = groupId;
        }
        return Img
        .find(query)
        .exec();
  },

  // 根据group_id获取一组照片
  getGroups: function getGroups() {
      return ImgsGroup.find({}).sort({ _id: -1 }).exec();
  },

  // 上传照片
  upLoadImgs: function upLoadImgs(group) {
    let { imgs, info } = group;
    console.log(group, imgs, info)
    info.created_at = moment().format('YYYY-MM-DD HH:mm');

    return ImgsGroup.create(info)
      .exec()
      .then(function (res) {
        if (res.result.ok && res.result.n > 0) {
          let { _id, title } = res.ops[0];
          imgs.map(item => {
            item.src = `http://pnmpntc1j.bkt.clouddn.com/${item.key}`;
            item.group_id = _id;
          });

          return Img.create(imgs).exec()
          .then(function (imgsRes) {
            imgsRes = imgsRes.ops.map(item => {
              return {
                ...item,
                title
              }
            });
            return imgsRes;
          });
        }
    });
  }
}