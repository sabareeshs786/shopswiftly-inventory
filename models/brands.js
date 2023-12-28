const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    brand: {
        type: String,
        required: true,
        unique: false
    },
    category: {
        type: String,
        required: true,
        unique: false
    }
}, {timestamps: true});

brandSchema.index({ brand: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Brand', brandSchema);