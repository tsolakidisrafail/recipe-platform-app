const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const config = require('../config/env');

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token; // Get token from cookies
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Get token from authorization header
    }
    if (!token) {
        return next(new ErrorResponse('Δεν έχετε εξουσιοδότηση για πρόσβαση σε αυτή τη σελίδα (No Token)', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Find user by ID and exclude password and other sensitive fields
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new ErrorResponse('Ο χρήστης δεν βρέθηκε (User not found)', 401));
    }

    next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return next(new ErrorResponse('Η συνεδρία σας έχει λήξει. Παρακαλώ συνδεθείτε ξανά (Session expired)', 401));
        }
        return next(new ErrorResponse('Δεν έχετε εξουσιοδότηση για πρόσβαση σε αυτή τη σελίδα (Invalid Token)', 401));
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ErrorResponse('Απαιτείται σύνδεση για έλεγχο ρόλου', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(
                `Ο ρόλος χρήστη σας (${req.user.role}) δεν έχει πρόσβαση σε αυτή τη λειτουργία`,
                403
            ));
        }
        next();
    };
};