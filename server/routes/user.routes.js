// ... imports ...
const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserRecipes
} = require('../controllers/user.controller'); // Import user controllers

const { protect, authorize } = require('../middleware/auth'); // Import protect & authorize middleware

const router = express.Router();

// Public routes
router.get('/:id', getUserProfile);
router.get('/:id/recipes', getUserRecipes);

// Protected Route for updating own profile
router.put('/profile/update', protect, updateUserProfile);

router.route('/')
    .get(protect, authorize('admin'), getUsers); // Admin route to get all users

router.route('/:id')
    .delete(protect, authorize('admin'), deleteUser); // Admin route to delete a user

module.exports = router;