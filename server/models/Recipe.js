const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: String, required: true},
    unit: { type: String }
}, { _id: false });

const RecipeSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, 'Ο τίτλος της συνταγής είναι υποχρεωτικός'],
        trim: true,
        maxlength: [150, 'Ο τίτλος της συνταγής δεν μπορεί να είναι μεγαλύτερος από 150 χαρακτήρες']
    },
    description: { 
        type: String,
        required: [true, 'Η περιγραφή της συνταγής είναι υποχρεωτική'],
        trim: true,
        maxlength: [5000, 'Η περιγραφή της συνταγής δεν μπορεί να είναι μεγαλύτερη από 5000 χαρακτήρες']
    },
    ingredients: [IngredientSchema],
    steps: {
        type: [String],
        required: true,
        validate: [v => Array.isArray(v) && v.length > 0, 'Πρέπει να υπάρχει τουλάχιστον ένα βήμα']
    },
    cookingTime: { 
        type: Number,
        min: [1, 'Ο χρόνος μαγειρέματος πρέπει να είναι τουλάχιστον 1 λεπτό'],
    },
    prepTime: {
        type: Number,
        min: [1, 'Ο χρόνος προετοιμασίας πρέπει να είναι τουλάχιστον 1 λεπτό'],
    },
    servings: { 
        type: Number,
        min: [1, 'Ο αριθμός μερίδων πρέπει να είναι τουλάχιστον 1'],
    },
    category: {
        type: String,
        trim: true,
        enum: ['Ορεκτικό', 'Κυρίως πιάτο', 'Επιδόρπιο', 'Σαλάτα', 'Σούπα']
    },
    imageUrl: {
        type: String,
        match: [/^(ftp|http|https):\/\/[^ "]+$/, 'Παρακαλώ εισάγετε μια έγκυρη διεύθυνση URL']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: [0, 'Η μέση βαθμολογία δεν μπορεί να είναι μικρότερη από 0'],
        max: [5, 'Η μέση βαθμολογία δεν μπορεί να είναι μεγαλύτερη από 5'],
        set: val => Math.round(val * 10) / 10 // Round to one decimal place
    },
    numberOfRatings: {
        type: Number,
        default: 0
    },
    comments: [ { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, text: String, date: Date } ]
}, {
    timestamps: true
});

RecipeSchema.index({ title: 'text', description: 'text', category: 1 });
RecipeSchema.index({ createdBy: 1 });
RecipeSchema.index({ averageRating: -1 });

RecipeSchema.virtual('totalTime').get(function() {
    return (this.prepTime || 0) + (this.cookingTime || 0);
});

RecipeSchema.statics.calculateAverageRating = async function(recipeId) {}

RecipeSchema.pre('remove', async function(next) {});

module.exports = mongoose.model('Recipe', RecipeSchema);