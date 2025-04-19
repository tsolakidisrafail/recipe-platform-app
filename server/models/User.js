const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε ένα όνομα χρήστη'],
        unique: true,
        trim: true,
        minlength: [3, 'Το όνομα χρήστη πρέπει να έχει τουλάχιστον 3 χαρακτήρες']
    },
    email: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε μια διεύθυνση email'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε έναν κωδικό πρόσβασης'],
        minlength: [8, 'Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 8 χαρακτήρες'],
        select: false // Do not return password by default
    },
    firstName: String,
    lastName: String,
    profilePicture: String,
    savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    points: { 
        type: Number,
        default: 0,
        min: [0, 'Οι πόντοι δεν μπορούν να είναι αρνητικοί']
    },
    level: {
        type: Number,
        default: 1
    },
}, {
    timestamps: true
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
};

module.exports = mongoose.model('User', UserSchema);