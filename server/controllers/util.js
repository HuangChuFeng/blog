const fs = require('fs');
const nodemailer  = require('nodemailer');	
// 上线时修改
const DEV_URL = 'http://localhost';
// const DEV_URL = 'http://www.huangchufeng.site';
module.exports = { 
    domain: DEV_URL + ':3000/',
    //删除临时图片目录下的所有图片
    deleteFolder: (path) => {
        var files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                var curPath = path + '/' + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolder(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    transporter: () => {
        // 创建一个SMTP客户端配置
        const Emailconfig = {
            host: 'smtp.qq.com', 
            port: 465, //25,
            SSLOnConnect: true,
            secureConnection: true,
            // secure: true, // 使用SSL方式（安全方式，防止被窃取信息）
            auth: {
                user: '1378894282@qq.com', //刚才注册的邮箱账号
                pass: 'ewlvdbbrroygicgh'  //邮箱的授权码，不是注册时的密码
            }
        };
        // 创建一个SMTP客户端对象
        return nodemailer.createTransport(Emailconfig);
    }
}