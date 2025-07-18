const { User } = require('../models');

class UserService {
  static async createUser(data) {
    return User.create(data);
  }

  static async getUserById(id) {
    return User.findByPk(id);
  }

  static async getAllUsers() {
    return User.findAll();
  }

  static async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.update(data);
    return user;
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new Error('User not found');
    await user.destroy();
  }
}

module.exports = UserService;
