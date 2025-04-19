const Recipe = require('../models/Recipe');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllRecipes = asyncHandler(async (req, res, next) => {
    const recipes = await Recipe.find()
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: recipes.length,
        data: recipes
    });
});

exports.getRecipeById = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'username');
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: recipe });
});

exports.createRecipe = asyncHandler(async (req, res, next) => {
        req.body.createdBy = req.user.id;

        const user = await User.findById(req.body.createdBy);
        if (!user) {
            return next(new ErrorResponse(`User not found with id ${req.body.createdBy}`, 404));
        }

        const recipe = await Recipe.create(req.body);
        user.points += 10; // Increment user points by 10 for creating a recipe
        await user.save();

        res.status(201).json({
            success: true,
            data: recipe
        });
});

exports.updateRecipe = asyncHandler(async (req, res, next) => {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`, 404));
    }

    // Check if the user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this recipe`, 401));
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: recipe });
});

exports.deleteRecipe = asyncHandler(async (req, res, next) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
        return next(new ErrorResponse(`Recipe not found with id ${req.params.id}`, 404));
    }

    // Check if the user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this recipe`, 401));
    }

    await recipe.deleteOne();
    res.status(200).json({ success: true, data: {} });
});