const mongoose = require('mongoose');
const { adminProductsDBConn } = require('../config/dbConnect');

const counterSchema = new mongoose.Schema({
    field: { 
        type: String, 
        required: true,
    },
    value: { 
        type: Number, 
        default: 0 
    }
}, {timestamps: true});

const Counter = adminProductsDBConn.model('Counter', counterSchema);

module.exports = Counter;