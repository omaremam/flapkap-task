const { User, Product, sequelize } = require('../models');

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
  }
}

exports.deposit = async (userId, amount) => {
    return await sequelize.transaction(async (t) => {
      // This just increments the deposit by amount directly in DB
      // It is atomic so no race condition even if 2 users hit this at the same time
      // No need to manually lock or use serializable transactions  
      const [rowsAffected] = await User.increment('deposit', {
        by: amount, // just add this much to whatever is already there
        where: { id: userId },
        transaction: t,
      });
  
      if (rowsAffected === 0) {
        console.log("HERE")
        throw new ClientError('User not found');
      }
  
      const updatedUser = await User.findOne({
        where: { id: userId },
        transaction: t,
      });
  
      if (!updatedUser) {
        throw new ClientError('User not found');
      }
  
      return updatedUser.deposit;
    });
};
    

exports.buy = async (userId, productId, amount) => {
    return await sequelize.transaction(async (t) => {
      // Find the product and lock it
      const product = await Product.findByPk(productId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!product) {
        throw new ClientError('Product not found');
      }
  
      // Make sure there's enough product
      if (product.amountAvailable < amount) {
        throw new ClientError(`Insufficient stock. Available: ${product.amountAvailable}, Requested: ${amount}`);
      }
  
      // Calculate total cost
      const totalCost = product.cost * amount;
  
      // Find the user and lock their row too
      const user = await User.findByPk(userId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!user) {
        throw new ClientError('User not found');
      }
  
      // Debug logging
      console.log(`DEBUG: User ID: ${userId}, Deposit: ${user.deposit}, Total Cost: ${totalCost}, Product Cost: ${product.cost}`);
  
      // Make sure user has enough balance
      if (user.deposit < totalCost) {
        throw new ClientError(`Insufficient funds. Required: ${totalCost}, Available: ${user.deposit}`);
      }
  
      // Calculate change and validate it can be made with available denominations
      const change = user.deposit - totalCost;
      if (!canMakeChange(change)) {
        throw new ClientError(`Cannot make change of ${change} cents with available denominations (5, 10, 20, 50, 100). Please adjust your purchase.`);
      }
  
      // Reduce the stock
      await Product.increment('amountAvailable', {
        by: -amount,
        where: { id: productId },
        transaction: t,
      });
  
      console.log(`DEBUG: Before increment - User deposit: ${user.deposit}, Deducting: ${totalCost}`);
      await User.increment('deposit', {
        by: -totalCost,
        where: { id: userId },
        transaction: t,
      });
      
      // Get updated user to verify the change
      const updatedUser = await User.findByPk(userId, { transaction: t });
      console.log(`DEBUG: After increment - User deposit: ${updatedUser.deposit}`);
  
      return {
        productId,
        amount,
        totalSpent: totalCost,
        change: change,
        productName: product.productName,
      };
    });
  };

  function canMakeChange(amount) {
    if (amount === 0) return true;
    if (amount < 0) return false;
  
    const coins = [100, 50, 20, 10, 5];
    let left = amount;
  
    for (const coin of coins) {
      // Keep subtracting as long as this coin fits
      while (left >= coin) {
        left -= coin;
      }
    }
  
    return left === 0;
  }
  