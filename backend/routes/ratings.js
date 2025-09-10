const express = require('express');
const { body, param } = require('express-validator');
const { 
  getAllRatings, 
  getRatingById, 
  createRating, 
  updateRating, 
  deleteRating,
  getUserRatings
} = require('../controllers/ratingController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createRatingValidation = [
  body('storeId')
    .isInt()
    .withMessage('Store ID must be a valid integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review text must not exceed 1000 characters')
];

const updateRatingValidation = [
  param('id').isInt().withMessage('Rating ID must be a valid integer'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Review text must not exceed 1000 characters')
];

const ratingIdValidation = [
  param('id').isInt().withMessage('Rating ID must be a valid integer')
];

// Routes
router.get('/', authenticateToken, getAllRatings);
router.get('/my-ratings', authenticateToken, getUserRatings);
router.get('/:id', authenticateToken, ratingIdValidation, getRatingById);
router.post('/', authenticateToken, createRatingValidation, createRating);
router.put('/:id', authenticateToken, updateRatingValidation, updateRating);
router.delete('/:id', authenticateToken, ratingIdValidation, deleteRating);

module.exports = router;

