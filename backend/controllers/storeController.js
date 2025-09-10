const { Store, User, Rating, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
    // Build where clause for filtering
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Handle sorting - some fields need special handling
    let orderClause;
    let needsPostProcessing = false;
    
    if (sortBy === 'totalRatings' || sortBy === 'averageRating') {
      // For calculated fields, we'll sort after processing
      orderClause = [['created_at', 'DESC']]; // Default sort
      needsPostProcessing = true;
    } else {
      orderClause = [[sortBy, sortOrder.toUpperCase()]];
    }

    // Get stores with pagination, filtering, and average rating
    let queryOptions = {
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          attributes: ['rating'],
          required: false
        }
      ],
      order: orderClause
    };

    // Only apply pagination if we don't need post-processing
    if (!needsPostProcessing) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = parseInt(offset);
    }

    const { count, rows: stores } = await Store.findAndCountAll(queryOptions);

    // Calculate average rating for each store
    let storesWithRating = stores.map(store => {
      const storeData = store.toJSON();
      const ratings = storeData.ratings || [];
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2)
        : 0;
      
      return {
        ...storeData,
        averageRating: parseFloat(averageRating),
        totalRatings: ratings.length,
        ratings: undefined // Remove detailed ratings from response
      };
    });

    // Sort by calculated fields if needed
    if (needsPostProcessing) {
      storesWithRating.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (sortOrder.toUpperCase() === 'ASC') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });

      // Apply pagination after sorting
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      storesWithRating = storesWithRating.slice(startIndex, endIndex);
    }

    res.json({
      success: true,
      data: {
        stores: storesWithRating,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalStores: count,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stores',
      error: error.message
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate average rating
    const storeData = store.toJSON();
    const ratings = storeData.ratings || [];
    const averageRating = ratings.length > 0 
      ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        store: {
          ...storeData,
          averageRating: parseFloat(averageRating),
          totalRatings: ratings.length
        }
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store',
      error: error.message
    });
  }
};

const createStore = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, address, ownerId } = req.body;

    // Check if store already exists
    const existingStore = await Store.findOne({ where: { email } });
    if (existingStore) {
      return res.status(400).json({
        success: false,
        message: 'Store with this email already exists'
      });
    }

    // Verify owner exists if provided
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: 'Owner not found'
        });
      }
    }

    // Create new store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId: ownerId || null
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create store',
      error: error.message
    });
  }
};

const updateStore = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    // Find store
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== store.email) {
      const existingStore = await Store.findOne({ where: { email } });
      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: 'Store with this email already exists'
        });
      }
    }

    // Verify owner exists if provided
    if (ownerId) {
      const owner = await User.findByPk(ownerId);
      if (!owner) {
        return res.status(400).json({
          success: false,
          message: 'Owner not found'
        });
      }
    }

    // Update store
    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
      ownerId: ownerId !== undefined ? ownerId : store.ownerId
    });

    res.json({
      success: true,
      message: 'Store updated successfully',
      data: { store: store.toJSON() }
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update store',
      error: error.message
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Find store
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Delete store (this will also delete associated ratings due to CASCADE)
    await store.destroy();

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete store',
      error: error.message
    });
  }
};

const getStoreRatings = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify store exists
    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get ratings for the store
    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: { storeId: id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        ratings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalRatings: count,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch store ratings',
      error: error.message
    });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoreRatings
};

