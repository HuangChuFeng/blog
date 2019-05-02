const CommentModel = require("../models/Comment");
const authCheck = require("../middlewares/check").auth;

module.exports = {

    // 创建评论
    "POST /api/:id/comment": async ctx => {
        console.log('评论时获取session==========', ctx.session);
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        let { target } = ctx.params,
            sender = ctx.session.user._id,
            content = ctx.request.body.content,
            receiver = ctx.request.body.receiver
            resCode = 200,
            message = "评论成功";
        let comment = {
            sender,
            target,
            receiver,
            content
        };
        try {
            await CommentModel.create(comment);
        } catch (e) {
            console.log(e);
            message = "评论失败";
            resCode = 500;
        }
        ctx.response.body = {
            resCode,
            message,
            comment
        };
    },
}