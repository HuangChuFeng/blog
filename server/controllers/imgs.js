const ImgModel = require("../models/imgs");
const CommentModel = require("../models/comment");
const UserModel = require("../models/user");
const authCheck = require("../middlewares/check").auth;
const path = require("path");
const fs = require('fs');
const { deleteFolder, domain, transporter } = require('./util')
console.log('domain======', domain);

module.exports = {
    // GET /imgs 所有照片
    "GET /api/imgs": async ctx => {
        const { category, pageNum, pageSize } = ctx.request.query;
        let resCode = 200,
            error = '',
            message = "ok",
            imgs = []
            allCount = 0;
        try {
            let groups = await ImgModel.getGroups(category, pageNum, Number(pageSize));
            for (let i = 0; i < groups.length; i++) {
                let subImgs = await ImgModel.getImgsByGroupId(groups[i]._id, true);
                delete subImgs.pv;
                subImgs = Object.assign(subImgs, {
                    src: subImgs.src ? subImgs.src.replace(/:3000/, '') : '',
                    title: groups[i].title,
                })
                imgs.push(subImgs);
            }
            allCount = await ImgModel.getGroupCount(category);
        } catch (e) {
            resCode = 500;
            console.log(e);
            error = e;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            imgs,
            allCount,
            error
        };
    },

    // GET 组图
    "GET /api/groupImgs": async ctx => {
        const { groupId } = ctx.request.query;
        let resCode = 200,
            message = "ok",
            group = {};
        try {
            let groupInfo = await ImgModel.getGroupImgs(groupId);
            let imgs = await ImgModel.getImgsByGroupId(groupInfo[0]._id);
            imgs.forEach(item => {
                item.src && (item.src = item.src.replace(/:3000/, ''))
            })
            group = {
                info: groupInfo[0],
                imgs,
            }
        } catch (e) {
            resCode = 500;
            console.log(e);
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            group,
        };
    },

    // 按照id获取照片 // 上一张or下一张
    "GET /api/imgs/:imgId": async ctx => {
        const { imgId } = ctx.params,
            typeNum = ctx.request.query.typeNum;

        let resCode = 200,
            message = 'ok',
            noMore = false;
        try {
            var img = [], comment = [];
            if (typeNum !== 'undefined') {
                img = await ImgModel.getLastOrNextImg(imgId, typeNum);
                if (img.length === 0) {
                    noMore = true;
                } else {
                    noMore = false;
                    comment = await CommentModel.getComments(img[0]._id);
                }
            } else {
                // 按照id获取照片
                let result = await Promise.all([
                    ImgModel.getImgById(imgId),
                    CommentModel.getComments(imgId), // 获取该照片所有评论
                ]);
                img = result[0];
                comment = result[1];
                if (result[0].length === 0) {
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
        if (img.length > 0) {
            img[0] = {
                ...img[0],
                src: img[0].src.replace(/:3000/, ''),
                groupId: img[0].group_id._id,
                author: img[0].group_id.author,
            }
            delete img[0].group_id
        }
        // 判断评论接收者是不是当前用户
        comment.forEach(item => {
            item.isReceiver = false
            if(item.receiver ===  ctx.session.user._id) {
                item.isReceiver = true
            }
        })
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
        const isLogined = await authCheck(ctx);
        if (!isLogined) {
            return;
        }
        let { imgId } = ctx.params,
            { imgName, groupId } = ctx.request.query,
            resCode = 200,
            message = "删除成功";
        try {
            if (!imgId) {
                throw new Error("照片不存在");
            }
            await ImgModel.delImgById(imgId);
            // 删除对应图片
            let tempPath = path.resolve(__dirname, '../build/upload/photograph/' + groupId + '/' + imgName);
            fs.unlink(tempPath)
            let imgs = await ImgModel.getImgsByGroupId(groupId);
            if(!imgs.length) {
                await ImgModel.delGroupById(groupId);
                // 删除文件夹
                tempPath = path.resolve(__dirname, '../build/upload/photograph/' + groupId);
                fs.rmdirSync(tempPath);
            }
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

    // 更新照片浏览量
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

    // 更新图片喜欢数量
    "GET /api/imgs/:imgId/addImgFavor": async ctx => {
        const isLogined = await authCheck(ctx);
        if(!isLogined) {
            return;
        }
        let { imgId } = ctx.params,
            userId = ctx.session.user._id,
            resCode = 200,
            message = "更新成功",
            type = 0;
        try {
            if (!imgId) {
                throw new Error("照片不存在");
            }
            let userInfo = await UserModel.getUserById(userId);
            console.log('likes=======', userInfo.likes);
            if(userInfo.likes.indexOf(imgId) === -1) {
                type = 1;
            }
            await ImgModel.addImgFavor(imgId, type);
            await UserModel.updateLikes(imgId, userId, type);
            if(type === 1) {
                // 发送邮件通知
                var countOptions = {
                    from: '"____cranky 👻" <1378894282@qq.com>',
                    to: 'chufeng_huang@163.com',
                    subject: '照片喜爱',
                    text: `一封来自"____就算减不下去也要继续减肥的可能被摄影耽误的程序员网站"的邮件`,
                    html: `<p>来自${ctx.session.user.source}的${ctx.session.user.name}喜欢了你的照片:<a href="http://www.huangchufeng.site/photograph/detail//${imgId}">点击查看详情</a></p>`,
                }; 
                transporter().sendMail(countOptions, function(err, msg){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('发送邮件成功: ', `www.huangchufeng.site/photograph/detail/${imgId}`);
                    }
                });
            }
        } catch (e) {
            console.log(e);
            message = "更新失败";
            resCode = 500;
        }
        ctx.response.body = {
            resCode,
            message,
            type
        };
    },

    // 发布图片
    "POST /api/imgs/publish": async (ctx, next) => {
        const isLogined = await authCheck(ctx);
        if (!isLogined) {
            return;
        }
        let resCode = 200,
            message = "ok",
            group = ctx.request.body,
            newImgs = [];
        group.info.author = ctx.session.user._id;
        try {
            // 处理照片路径, 从临时目录里移到对应的照片组目录下
            let groupPath = ''
            var groupRes = await ImgModel.createImgGroup(group.info);
            if (groupRes.result.ok) {
                let groupId = groupRes.ops[0]._id;
                const groupPath = path.resolve(__dirname, '../build/upload/photograph/' + groupId);
                if (!fs.existsSync(groupPath)) {
                    fs.mkdirSync(groupPath);
                }
                group.imgs.forEach(img => {
                    let oldPath = path.resolve(__dirname, '../build/tempFolder/' + img.name);
                    let newPath = path.resolve(__dirname, '../build/upload/photograph/' + groupId + '/' + img.name);
                    fs.renameSync(oldPath, newPath);
                    newImgs.push({
                        group_id: groupId,
                        src: domain + 'upload/photograph/' + groupId + '/' + img.name,
                        h: img.h,
                        w: img.w
                    })
                })
            }
            var imglist = await Promise.all(newImgs.map(item => {
                return ImgModel.createImgs(item);
            }))
            imglist = imglist.map(item => {
                return item.ops[0]
            })
            // 删除临时目录下的所有图片
            let tempPath = path.resolve(__dirname, '../build/tempFolder');
            deleteFolder(tempPath);
        } catch (e) {
            console.log(e);
            resCode = 500;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            imglist,
        };
    },

    // 上传图片
    "POST /api/uploadImg": async (ctx, next) => {
        let resCode = 200,
            message = "ok",
            fileName = '';
        try {
            let file = ctx.request.files.file;
            let arr = file.path.split('/')
            fileName = arr[arr.length - 1]
        } catch (e) {
            console.log(e);
            resCode = 500;
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            fileName,
            url: domain + 'tempFolder/' + fileName
        };
    }
}