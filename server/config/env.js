require('dotenv').config();

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5001,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    db: {
        mongoUri: process.env.MONGODB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
};

if (!config.jwt.secret) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1); // Exit process with failure
}
if (!config.db.mongoUri) {
    console.error("FATAL ERROR: MONGODB_URI is not defined.");
    process.exit(1); // Exit process with failure
}

module.exports = config;