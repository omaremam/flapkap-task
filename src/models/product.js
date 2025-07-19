const { Model, DataTypes } = require('sequelize');

class Product extends Model {}

function initProduct(sequelize) {
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
  });
  return Product;
}

module.exports = initProduct; 