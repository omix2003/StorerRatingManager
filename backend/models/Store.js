const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Store name cannot be empty'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      }
    }
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: {
        args: [1, 400],
        msg: 'Address must not exceed 400 characters'
      }
    }
  },
  category: {
    type: DataTypes.ENUM('food', 'electronics', 'groceries', 'clothing', 'health', 'beauty', 'sports', 'books', 'home', 'automotive', 'other'),
    allowNull: false,
    defaultValue: 'other',
    validate: {
      isIn: {
        args: [['food', 'electronics', 'groceries', 'clothing', 'health', 'beauty', 'sports', 'books', 'home', 'automotive', 'other']],
        msg: 'Please select a valid category'
      }
    }
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'owner_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'stores'
});

module.exports = Store;
