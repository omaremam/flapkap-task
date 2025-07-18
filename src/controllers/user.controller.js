const UserService = require('../services/user.service');

const UserController = {
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      if(!users) return res.status(200).send([]);
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = UserController;
