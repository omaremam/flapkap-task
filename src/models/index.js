const { Sequelize } = require('sequelize');
const initUser = require('./user');
const initProduct = require('./product');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const User = initUser(sequelize);
const Product = initProduct(sequelize);

User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

module.exports = {
  sequelize,
  User,
  Product,
};
