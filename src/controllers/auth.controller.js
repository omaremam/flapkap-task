const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserService = require('../services/user.service');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

const AuthController = {
  async register(req, res) {
    try {
      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ error: 'username, password, and role are required' });
      }
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
      if (!username || !password) {
        return res.status(400).json({ error: 'username and password are required' });
      }
      const user = await User.findOne({ where: { username } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = AuthController;
