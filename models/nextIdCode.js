const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nextIdCodeSchema = Schema({
    skuid: {
        type: Number,
    },
    bcCode: {
        type: Number
    },
}, { timestamps: true });

module.exports = mongoose.model('NextIdCode', nextIdCodeSchema, 'nextIdCodes');