const ErrorResponse = require('../utils/errorResponse');
const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
    console.error('ERROR ----->\n', err);

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value entered: [${field}]`;
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        const message = `Validation error: ${messages.join(', ')}`;
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Not authorized, token failed';
        error = new ErrorResponse(message, 401);
    }
    if (err.name === 'TokenExpiredError') {
        const message = 'Not authorized, token expired';
        error = new ErrorResponse(message, 401);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;