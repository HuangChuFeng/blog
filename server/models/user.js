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
    getEmailById: function getEmailById(id) {
        return User
        .findOne({ _id: id })
        .exec();
    },
};