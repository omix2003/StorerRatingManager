const express = require('express');
const { body, param } = require('express-validator');
const { 
  getAllStores, 
  getStoreById, 
  createStore, 
  updateStore, 
  deleteStore,
  getStoreRatings,
  getMyStores,
  getMyStoreRatings,
  getMyStoreStats
} = require('../controllers/storeController');
const { authenticateToken, isAdmin, isStoreOwner } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createStoreValidation = [
  body('name')
    .notEmpty()
    .withMessage('Store name is required'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('category')
    .optional()
    .isIn(['food', 'electronics', 'groceries', 'clothing', 'health', 'beauty', 'sports', 'books', 'home', 'automotive', 'other'])
    .withMessage('Please select a valid category'),
  body('ownerId')
    .optional()
    .isInt()
    .withMessage('Owner ID must be a valid integer')
];

const updateStoreValidation = [
  param('id').isInt().withMessage('Store ID must be a valid integer'),
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Store name cannot be empty'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('category')
    .optional()
    .isIn(['food', 'electronics', 'groceries', 'clothing', 'health', 'beauty', 'sports', 'books', 'home', 'automotive', 'other'])
    .withMessage('Please select a valid category'),
  body('ownerId')
    .optional()
    .isInt()
    .withMessage('Owner ID must be a valid integer')
];

const storeIdValidation = [
  param('id').isInt().withMessage('Store ID must be a valid integer')
];

// Routes
router.get('/', authenticateToken, getAllStores);

// Store owner routes (must come before /:id routes to avoid conflicts)
router.get('/my/stores', authenticateToken, isStoreOwner, getMyStores);
router.get('/my/ratings', authenticateToken, isStoreOwner, getMyStoreRatings);
router.get('/my/stats', authenticateToken, isStoreOwner, getMyStoreStats);

// Individual store routes
router.get('/:id', authenticateToken, storeIdValidation, getStoreById);
router.get('/:id/ratings', authenticateToken, storeIdValidation, getStoreRatings);

// Admin only routes
router.post('/', authenticateToken, isAdmin, createStoreValidation, createStore);
router.put('/:id', authenticateToken, isAdmin, updateStoreValidation, updateStore);
router.delete('/:id', authenticateToken, isAdmin, storeIdValidation, deleteStore);

module.exports = router;

