// 操作数据库
module.exports = {
  // 获取所有照片
  getImgs: function getImgs() {
    var imgs =  [];
    for(let i = 1; i < 45; i++) {
      imgs.push({
        id: i,
        src: `static/img/img${i}.jpg`,
      })
    }
    return imgs;
  },

  // 根据id获取照片详情
}