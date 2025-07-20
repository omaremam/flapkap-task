const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

// Simple client error class
class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
  }
}

const AuthService = {
  async login(username, password) {
    if (!username || !password) {
      throw new ClientError('username and password are required');
    }
    const user = await User.findOne({ where: { username } });
    if (!user) throw new ClientError('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ClientError('Invalid credentials');
    user.password = undefined;
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return { token, user };
  },
};

module.exports = AuthService;
