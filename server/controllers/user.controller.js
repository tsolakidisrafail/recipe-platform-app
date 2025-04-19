const User = require('../models/User');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    const profileData = {
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        points: user.points,
        level: user.level,
        recipes: recipes
    };

    res.status(200).json({ success: true, data: profileData });
});

exports.getUserRecipes = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorResponse(`User not found with id ${req.params.id}`, 404));
    }

    const recipes = await Recipe.find({ createdBy: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({ 
        success: true,
        count: recipes.length,
        data: recipes
    });
});

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { username, email } = req.body;

    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return next(new ErrorResponse('No fields to update', 400));
    }

    try {
        const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
            new: true,
            runValidators: true
        });
        if (!user) {
            return next(new ErrorResponse(`User not found with id ${userId}`, 404));
        }

        const userResponse = { ... user.toObject() };
        delete userResponse.password; // Remove password from response

        res.status(200).json({ success: true, data: userResponse });
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return next(new ErrorResponse(`${field} already exists`, 400));
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ErrorResponse(messages.join(', '), 400));
        }
        next(error);
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password');

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorResponse(`User not found with id ${req.params.id}`, 404)
        );
    }


    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
});