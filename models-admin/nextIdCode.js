const mongoose = require('mongoose');
const { adminProductsDBConn } = require('../config/dbConnect');
const Schema = mongoose.Schema;

const nextIdCodeSchema = Schema({
    skuid: {
        type: Number,
    },
    bcCode: {
        type: Number
    },
}, { timestamps: true });

module.exports = adminProductsDBConn.model('NextIdCode', nextIdCodeSchema, 'nextIdCodes');