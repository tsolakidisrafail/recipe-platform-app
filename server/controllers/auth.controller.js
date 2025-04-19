const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

const getSignedJwtToken = (userId) => {
    return jwt.sign({ id: userId }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = getSignedJwtToken(user._id);
    const options = {
        expires: new Date(Date.now() + parseInt(config.jwt.expiresIn) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'Strict'
    };

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: userResponse
        });
};

exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.create({ 
            username,
            email,
            password
        });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return next(new ErrorResponse(`Το ${field} χρησιμοποιείται ήδη`, 400));
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ErrorResponse(messages.join(', '), 400));
        }
        next(error);
    }
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Παρακαλώ συμπληρώστε το email και τον κωδικό πρόσβασης', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Λάθος στοιχεία σύνδεσης', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Λάθος στοιχεία σύνδεσης', 401));
    }

    sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorResponse('Δεν βρέθηκε χρήστης. Πιθανόν απαιτείται σύνδεση.', 404));
    }
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: req.user });
});

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'Strict'
    });

    res.status(200).json({ success: true, data: {} });
}
);