const User = require('../lib/mongo').User;

module.exports = {
  //通过用户名获取用户信息
  getUserById: function getUserById(id) {
    return User
        .findOne({ _id: id })
        .exec();
    },
    create: function create(user) {
        return User.create(user).exec();
    }
};