const { Rating, Store, User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

const getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, storeId, userId, rating, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    
    // Build where clause for filtering
    const whereClause = {};
    if (storeId) whereClause.storeId = storeId;
    if (userId) whereClause.userId = userId;
    if (rating) whereClause.rating = rating;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get ratings with pagination and filtering
    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
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
    console.error('Get all ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings',
      error: error.message
    });
  }
};

const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rating = await Rating.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    res.json({
      success: true,
      data: { rating }
    });
  } catch (error) {
    console.error('Get rating by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rating',
      error: error.message
    });
  }
};

const createRating = async (req, res) => {
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

    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Verify store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check if user already rated this store
    const existingRating = await Rating.findOne({
      where: { userId, storeId }
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this store. Use update to modify your rating.'
      });
    }

    // Create new rating
    const newRating = await Rating.create({
      userId,
      storeId,
      rating
    });

    // Fetch the created rating with associations
    const createdRating = await Rating.findByPk(newRating.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: { rating: createdRating }
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rating',
      error: error.message
    });
  }
};

const updateRating = async (req, res) => {
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
    const { rating } = req.body;
    const userId = req.user.id;

    // Find rating
    const existingRating = await Rating.findByPk(id);
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user owns this rating or is admin
    if (existingRating.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own ratings'
      });
    }

    // Update rating
    await existingRating.update({ rating });

    // Fetch the updated rating with associations
    const updatedRating = await Rating.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: { rating: updatedRating }
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rating',
      error: error.message
    });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find rating
    const rating = await Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user owns this rating or is admin
    if (rating.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own ratings'
      });
    }

    // Delete rating
    await rating.destroy();

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rating',
      error: error.message
    });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get user's ratings
    const { count, rows: ratings } = await Rating.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['id', 'name', 'address']
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
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user ratings',
      error: error.message
    });
  }
};

module.exports = {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deleteRating,
  getUserRatings
};

