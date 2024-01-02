const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true
    }
}, {timestamps: true});

categorySchema.index({category: 1, path: 1}, {unique: true});

module.exports = mongoose.model('Category', categorySchema, 'categories');