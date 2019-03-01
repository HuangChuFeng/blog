const photographyModel = require("../models/imgs");

const qiniu = require('qiniu'); // 需要加载qiniu模块的
const accessKey = 'vqKACy0T5ynoVPNoamgDmUMHxH8GRxsyQnswE9IF';
const secretKey = 'x2UGD15Dqi7axFm5AZPkFRoU4sE9kk40xpi7F5S6';
const bucket = 'huangchufeng';

module.exports = {
  // GET /imgs 所有照片
  "GET /api/imgs": async ctx => {
    let resCode = 200,
      message = "ok",
      imgs = [];
    try {
      let groups = await photographyModel.getGroups();
      for(let i = 0; i < groups.length; i++) {
        let subImgs = await photographyModel.getImgsByGroupId(groups[i]._id);
        subImgs = subImgs.map(item => {
          return {
            ...item,
            title: groups[i].title,
          }
        });
        imgs.push(...subImgs);
      }
    } catch (e) {
      resCode = 500;
      console.log(e);
      message = "服务器出错了";
    }
    ctx.response.body = {
      resCode,
      message,
      imgs,
    };
  },

  // 获取图片上传时需要的token
  "POST /api/token": async (ctx, next) => {
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // 指定上传策略
    let options = {
      scope: bucket,
      expires: 3600 * 24,
      returnBody: '{"key": $(key), "hash": $(etag), "w": $(imageInfo.width), "h": $(imageInfo.height)}'
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    let resCode = 200, message = 'ok';
    if (uploadToken) {
      ctx.response.body = {
        resCode,
        message,
        uploadToken
      }
    } else {
      message = '获取token失败';
      resCode = 500;
      ctx.response.body = {
        resCode,
        message,
      };
    }
  },

  // 上传照片
  "POST /api/imgs/upload": async (ctx, next) => {
    let resCode = 200,
        message = "ok",
        group = ctx.request.body;
    try {
      var imglist = await photographyModel.upLoadImgs(group);
      
    } catch (e) {
      resCode = 500;
      console.log(e);
      message = "服务器出错了";
    }
    ctx.response.body = {
      resCode,
      message,
      imglist,
    };
  }
}