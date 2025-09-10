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
