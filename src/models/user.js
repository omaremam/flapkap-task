const { Model, DataTypes } = require('sequelize');

class User extends Model {}

function initUser(sequelize) {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('BUYER', 'SELLER'),
      allowNull: false,
    },
    deposit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  });
  return User;
}

module.exports = initUser; 