const mongoose = require('mongoose');
const { productsDBConn } = require('../config/dbConnect');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    bcCode: {
        type: Number,
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
    }
}, {timestamps: true});

brandSchema.index({ brand: 1, category: 1 }, { unique: true });

module.exports = productsDBConn.model('Brand', brandSchema);