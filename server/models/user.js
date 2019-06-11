const User = require('../lib/mongo').User;

module.exports = {
    //通过用户邮箱获取用户信息
    getUserByEmail: function getUserByEmail(email) {
        return User
        .findOne({ email: email })
        .exec();
    },
    // 创建用户
    create: function create(user) {
        return User.create(user).exec();
    },
    // 根据id获取用户邮箱
    getUserById: function getUserById(id) {
        return User
        .findOne({ _id: id })
        .exec();
    },
    
    /** 
     * 更新用户likes
     * @type 0 减少, 1 增加
     **/
    updateLikes: function updateLikes(likeId, userId, type) {
        console.log({
            likeId, userId, type
        });
        
        if(type === 0) {
            return User.update({ _id: userId }, { $pull : { likes : likeId } }).exec();
        }
        return User.update({ _id: userId }, { $push : { likes : likeId } }).exec();
    }
};