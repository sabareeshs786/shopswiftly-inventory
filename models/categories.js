const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: false
    },
    path: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Brand', categorySchema);