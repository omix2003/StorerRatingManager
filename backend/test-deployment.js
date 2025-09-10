const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const { Store, User, Rating } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for testing
app.use(cors({
  origin: ['http://localhost:5173', 'https://storerratingmanager.onrender.com'],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    await testConnection();
    const storeCount = await Store.count();
    const userCount = await User.count();
    const ratingCount = await Rating.count();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      data: {
        stores: storeCount,
        users: userCount,
        ratings: ratingCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Test stores endpoint
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.findAll({
      limit: 6,
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: stores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
