// ... imports ...
const express = require('express');
const {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeCategories
} = require('../controllers/recipe.controller'); // Import recipe controllers
const Recipe = require('../models/Recipe'); // Import Recipe model
const { protect } = require('../middleware/auth'); // Import protect middleware

const router = express.Router();

router.route('/')
    .get(getAllRecipes) // Public route to get all recipes
    .post(protect, createRecipe); // Protected route to create a recipe

router.route('/:id')
    .get(getRecipeById) // Public route to get a recipe by ID
    .put(protect, updateRecipe) // Protected route to update a recipe
    .delete(protect, deleteRecipe); // Protected route to delete a recipe

module.exports = router;