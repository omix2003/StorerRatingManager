const { sequelize } = require('./config/database');
const { Store, Rating } = require('./models');

async function migrateSchema() {
  try {
    console.log('🔄 Starting database schema migration...');
    
    // Add category column to stores table
    console.log('📝 Adding category column to stores table...');
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS category VARCHAR(20) DEFAULT 'other' 
      CHECK (category IN ('food', 'electronics', 'groceries', 'clothing', 'health', 'beauty', 'sports', 'books', 'home', 'automotive', 'other'))
    `);
    
    // Add review_text column to ratings table
    console.log('📝 Adding review_text column to ratings table...');
    await sequelize.query(`
      ALTER TABLE ratings 
      ADD COLUMN IF NOT EXISTS review_text TEXT
    `);
    
    // Update existing stores to have 'other' category
    console.log('🔄 Updating existing stores with default category...');
    await Store.update(
      { category: 'other' },
      { where: { category: null } }
    );
    
    console.log('✅ Database schema migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSchema()
    .then(() => {
      console.log('🎉 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateSchema;
