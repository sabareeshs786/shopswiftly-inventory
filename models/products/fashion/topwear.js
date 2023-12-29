const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields } = require('../../../utils/fieldUtils');

const topwear = new Schema({
    ...commonFields,
    type: {
        type: String
    },
    sleeve: {
        type: String,
        enum: ["full", "half"]
    },
    fit: {
        type: String,
    },
    fabric: {
        type: String,
    },
    packof: {
        type: Number,
    },
    styleCode: {
        type: String,
    },
    neckType: {
        type: String,
    },
    idealfor: {
        type: [String]
    },
    size: {
        type: [String]
    },
    pattern: {
        type: String,
    },
    suitableFor: {
        type: String
    },
    fabricCare: {
        type: String
    },
    netQuantity: {
        type: Number
    }
});

module.exports = mongoose.model('MensTopWear', topwear, "menstopwear");