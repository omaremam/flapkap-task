const AuthService = require('../services/auth.service');
const UserService = require('../services/user.service');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const AuthController = {
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserService.createUser({
        username,
        password: hashedPassword,
        role,
      });
      res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const { token, user } = await AuthService.login(username, password);
      res.json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
