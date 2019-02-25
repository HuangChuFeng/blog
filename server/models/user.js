const User = require('../lib/mongo').User;

module.exports = {
  //通过用户名获取用户信息
  getUserByName: function getUserByName(name) {
    return User
        .findOne({ admin: name })
        .addCreatedAt()
        .exec();
    },
    create: function create(user) {
        return User.create(user).exec();
    }
};