const mongoose = require('mongoose');
const { productsDBConn } = require('../config/dbConnect');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true});

module.exports = productsDBConn.model('Category', categorySchema, 'categories');