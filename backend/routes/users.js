const express = require('express');
const { body, param } = require('express-validator');
const { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  updateMyProfile,
  deleteUser,
  getDashboardStats 
} = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('name')
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)
    .withMessage('Password must contain at least one uppercase letter and one special character'),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner')
];

const updateUserValidation = [
  param('id').isInt().withMessage('User ID must be a valid integer'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Role must be admin, user, or store_owner')
];

const userIdValidation = [
  param('id').isInt().withMessage('User ID must be a valid integer')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('address')
    .optional()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters')
];

// Routes
router.get('/dashboard/stats', authenticateToken, isAdmin, getDashboardStats);
router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, userIdValidation, getUserById);

// User profile management (for all authenticated users)
router.put('/profile', authenticateToken, updateProfileValidation, updateMyProfile);

// Admin only routes
router.post('/', authenticateToken, isAdmin, createUserValidation, createUser);
router.put('/:id', authenticateToken, isAdmin, updateUserValidation, updateUser);
router.delete('/:id', authenticateToken, isAdmin, userIdValidation, deleteUser);

module.exports = router;

