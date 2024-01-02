const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    bcCode: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // Category is included in the path
    path: {
        type: String,
        required: true
    }
}, {timestamps: true});

brandSchema.index({ brand: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Brand', brandSchema);