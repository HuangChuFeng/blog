const ImgModel = require("../models/imgs");
module.exports = {
    // GET /imgs 所有照片
    "GET /api/imgs": async ctx => {
      let resCode = 200,
          message;
      try {
        var imgs = await ImgModel.getImgs();
      } catch (e) {
        resCode = 500;
        message = "服务器出错了";
      }
      ctx.response.body = {
        resCode,
        message,
        imgs,
      };
    },
}