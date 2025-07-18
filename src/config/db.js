const { sequelize } = require('../models');

async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and models synced (Sequelize)');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
