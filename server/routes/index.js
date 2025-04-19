const express = require('express');
const recipeRoutes = require('./recipe.routes.js');
const userRoutes = require('./user.routes.js');
const authRoutes = require('./auth.routes.js');

const router = express.Router();

router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Recipe Platform API!' });
});

module.exports = router;