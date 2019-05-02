const User = require('../lib/mongo').User;

module.exports = {
  //通过用户邮箱获取用户信息
  getUserByEmail: function getUserByEmail(email) {
    return User
        .findOne({ email: email })
        .exec();
    },
    create: function create(user) {
        return User.create(user).exec();
    }
};