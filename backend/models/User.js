const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
    validate: {
      len: {
        args: [20, 60],
        msg: 'Name must be between 20 and 60 characters'
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
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 16],
        msg: 'Password must be between 8 and 16 characters'
      },
      isStrongPassword(value) {
        if (!/(?=.*[A-Z])/.test(value)) {
          throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
          throw new Error('Password must contain at least one special character');
        }
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
  role: {
    type: DataTypes.ENUM('admin', 'user', 'store_owner'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;


