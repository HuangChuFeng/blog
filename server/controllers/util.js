const fs = require('fs');
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
    }
}