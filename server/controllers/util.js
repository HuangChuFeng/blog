const fs = require('fs');
console.log('server', process.env.NODE_ENV);

const DEV_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://huangchufeng.site';
module.exports = { 
    domain: 'http://localhost:3000/',

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