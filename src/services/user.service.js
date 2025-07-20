const { User } = require('../models');

// Simple client error class
class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
  }
}

class UserService {
  static async createUser(data) {
    try {
      return await User.create(data);
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        if (error.fields && error.fields.username) {
          throw new ClientError('Username already exists');
        }
        throw new ClientError('Resource already exists');
      }
      if (error.name === 'SequelizeValidationError') {
        throw new ClientError(error.message);
      }
      throw error; // Re-throw other errors
    }
  }

  static async getUserById(id) {
    return User.findByPk(id);
  }

  static async getAllUsers() {
    return User.findAll();
  }

  static async updateUser(id, data) {
    const user = await User.findByPk(id);
    if (!user) throw new ClientError('User not found');
    await user.update(data);
    return user;
  }

  static async deleteUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw new ClientError('User not found');
    await user.destroy();
  }
}

module.exports = UserService;
