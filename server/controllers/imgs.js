const ImgModel = require("../models/imgs");
const CommentModel = require("../models/Comment");

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
      let groups = await ImgModel.getGroups();
      for(let i = 0; i < groups.length; i++) {
        let subImgs = await ImgModel.getImgsByGroupId(groups[i]._id);
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

  // 按照id获取照片 // 上一张or下一张
  "GET /api/imgs/:imgId": async ctx => {
      const { imgId } = ctx.params,
          typeNum =  ctx.request.query.typeNum;
          
      let resCode = 200,
          message = 'ok',
          noMore = false;
      try {
          var img = [], comment = [];
          if(typeNum !== 'undefined') {
              img = await ImgModel.getLastOrNextImg(imgId, typeNum);
              if(img.length === 0) {
                  noMore = true;
              } else {
                  noMore = false;
                  comment = await CommentModel.getComments(img[0]._id);
              }
          } else {
              // 按照id获取文章
              let result = await Promise.all([
                  ImgModel.getImgById(imgId),
                  CommentModel.getComments(imgId), // 获取该文章所有评论
              ]);
              img = result[0];
              comment = result[1];
              if(result[0].length === 0) {
                  noMore = true;
              } else {
                  noMore = false;
              }
          }
      } catch (e) {
          resCode = 500;
          console.log(e);
          message = "服务器出错了";
      }
      img[0] = {
        ...img[0],
        groupId: img[0].group_id._id,
        author: img[0].group_id.author,
      }
      delete img[0].group_id
      ctx.response.body = {
          resCode,
          message,
          img,
          comment,
          noMore
      };
  },

  // GET 删除一照片
  "GET /api/imgs/:imgId/remove": async ctx => {
    let { imgId } = ctx.params,
        resCode = 200,
        message = "删除成功";
    try {
        if (!imgId) {
            throw new Error("照片不存在");
        }
        await ImgModel.delImgById(imgId);
    } catch (e) {
        console.log(e);
        message = "删除失败";
        resCode = 500;
    }
    ctx.response.body = {
        resCode,
        message
    };
},

  // 更新文章浏览量
  "GET /api/imgs/:imgId/addImgPv": async ctx => {
    let { imgId } = ctx.params,
        resCode = 200,
        message = "更新成功";
    try {
        if (!imgId) {
            throw new Error("照片不存在");
        }
        await ImgModel.addImgPv(imgId);
    } catch (e) {
        console.log(e);
        message = "更新失败";
        resCode = 500;
    }
    ctx.response.body = {
        resCode,
        message,
    };
  },

  // 更新文章喜欢数量
  "GET /api/imgs/:imgId/addImgFavor": async ctx => {
    let { imgId } = ctx.params,
        resCode = 200,
        message = "更新成功";
    try {
        if (!imgId) {
            throw new Error("照片不存在");
        }
        await ImgModel.addImgFavor(imgId);
    } catch (e) {
        console.log(e);
        message = "更新失败";
        resCode = 500;
    }
    ctx.response.body = {
        resCode,
        message,
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
        group.info.author = ctx.session.user._id;
    try {
      var imglist = await ImgModel.upLoadImgs(group);
    } catch (e) {
      resCode = 500;
      message = "服务器出错了";
    }
    ctx.response.body = {
      resCode,
      message,
      imglist,
    };
  }
}