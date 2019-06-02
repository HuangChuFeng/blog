const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const authCheck = require("../middlewares/check").auth;
const nodemailer  = require('nodemailer');	
//通过发送邮件的方式修改密码
// 创建一个SMTP客户端配置
var Emailconfig = {
	host: 'smtp.qq.com', 
    port: 25,
        // secureConnection: true,
        // secure: true, // 使用SSL方式（安全方式，防止被窃取信息）
        auth: {
            user: '1378894282@qq.com', //刚才注册的邮箱账号
            pass: 'ewlvdbbrroygicgh'  //邮箱的授权码，不是注册时的密码
        }
    };

// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(Emailconfig);

module.exports = {
    // 创建评论
    "POST /api/:target/comment": async ctx => {
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        let { target } = ctx.params,
            sender = ctx.session.user._id,
            senderInfo = `来自${ctx.session.user.source}的${ctx.session.user.name}`;
        let { content, receiver, belongId, type } = ctx.request.body
            resCode = 200,
            message = "评论成功";
        let comment = {
            sender,
            senderInfo,
            target,
            receiver,
            content,
            belongId
        };
        
        try {
            await CommentModel.create(comment);
            // 发送邮件通知
            const recevierInfo = await UserModel.getEmailById(comment.receiver);
            console.log('接收邮箱', recevierInfo.email);
            var countOptions = {
                from: '1378894282@qq.com',
                to: recevierInfo.email,
                subject: '评论回复',
                text: `一封来自"____就算减不下去也要继续减肥的可能被摄影耽误的程序员网站"的邮件`,
                html: `<p>${recevierInfo.name}您好, 您的评论已有回复:<h5>${comment.content}</h5><a href="http://www.huangchufeng.site/${type === 1 ? 'photograph' : 'articles'}/detail/${comment.target}">点击查看</a></p>`,
            }; 
            transporter.sendMail(countOptions, function(err, msg){
                if(err){
                    console.log(err);
                } else {
                    console.log('发送邮件成功: ', `www.huangchufeng.site/${type === 0 ? 'photograph' : '/articles'}/detail/${comment.target}`);
                }
            });
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