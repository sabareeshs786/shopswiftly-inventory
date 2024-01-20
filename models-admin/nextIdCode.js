const mongoose = require('mongoose');
const { productsDBConn } = require('../config/dbConnect');
const Schema = mongoose.Schema;

const nextIdCodeSchema = Schema({
    skuid: {
        type: Number,
    },
    bcCode: {
        type: Number
    },
}, { timestamps: true });

module.exports = productsDBConn.model('NextIdCode', nextIdCodeSchema, 'nextIdCodes');