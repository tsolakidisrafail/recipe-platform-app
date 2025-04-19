// ... imports ...

const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updatePassword
} = require('../controllers/auth.controller'); // Import auth controllers

const { protect } = require('../middleware/auth'); // Import protect middleware

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout); // Protect the logout route
router.get('/me', protect, getMe); // Protect the getMe route
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword); // Reset password route
// router.put('/updatepassword', protect, updatePassword); // Protect the update password route


module.exports = router;