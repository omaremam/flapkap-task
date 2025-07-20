const vendingService = require('../services/vending.service');

exports.deposit = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    const result = await vendingService.deposit(userId, amount);
    res.status(200).json({ success: true, balance: result });
  } catch (error) {
    if (error.name === 'ClientError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

exports.buy = async (req, res, next) => {
  try {
    const { productId, amount } = req.body;
    const userId = req.user && req.user.id;
    const result = await vendingService.buy(userId, productId, amount);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    if (error.name === 'ClientError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};
