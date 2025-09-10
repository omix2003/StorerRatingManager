const { sequelize } = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Define associations
User.hasMany(Store, { foreignKey: 'ownerId', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log('✅ Database models synchronized successfully.');
  } catch (error) {
    console.error('❌ Error synchronizing database models:', error);
    throw error; // Re-throw the error so it can be caught by the server
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  syncDatabase
};
