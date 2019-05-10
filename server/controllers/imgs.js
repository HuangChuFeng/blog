const ImgModel = require("../models/imgs");
const CommentModel = require("../models/Comment");
const authCheck = require("../middlewares/check").auth;
const path = require("path");
const fs = require('fs');
const { deleteFolder, domain } = require('./util')

module.exports = {
    // GET /imgs 所有照片
    "GET /api/imgs": async ctx => {
        const { category, pageNum } = ctx.request.query;
        const pageSize = 10;
        let noMore = false;
        let resCode = 200,
            message = "ok",
            imgs = [];
        try {
            let groups = await ImgModel.getGroups(category);
            for (let i = 0; i < groups.length; i++) {
                let subImgs = await ImgModel.getImgsByGroupId(groups[i]._id);
                subImgs = subImgs.map(item => {
                    return {
                        ...item,
                        title: groups[i].title,
                    }
                });
                imgs.push(...subImgs);
            }
            if (imgs.length <= (pageNum - 1) * pageSize + pageSize) {
                noMore = true;
            }
            imgs = imgs.splice((pageNum - 1) * pageSize, pageSize)
        } catch (e) {
            resCode = 500;
            console.log(e);
            message = "服务器出错了";
        }
        ctx.response.body = {
            resCode,
            message,
            imgs,
            noMore
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
                // 按照id获取文章
                let result = await Promise.all([
                    ImgModel.getImgById(imgId),
                    CommentModel.getComments(imgId), // 获取该文章所有评论
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
                groupId: img[0].group_id._id,
                author: img[0].group_id.author,
            }
            delete img[0].group_id
        }
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
        const isLogined = await authCheck(ctx);
        if (!isLogined) {
            return;
        }
        let resCode = 200,
            message = "ok",
            fileName = '';
        try {
            let file = ctx.request.files.file;
            console.log('file==', file);

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