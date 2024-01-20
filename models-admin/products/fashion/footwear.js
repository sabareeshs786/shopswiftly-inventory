const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields } = require('../../../utils/models/fieldUtils');
const { adminProductsDBConn } = require('../../../config/dbConnect');

const footwearSchema = new Schema({
    ...commonFields,
    subcate: {
        type: String,
        enum: ["shoes", "slippers", "boots", "sneakers", "loafers", "flip-flops"]
    },
    occasion: {
        type: String,
        enum: ["casual", "ethnic", "formal", "party", "riding", "sports", "wedding"],
        required: true
    },
    gender: {
        type: String,
        enum: ["men", "women"],
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    color: {
        type: String
    },
    innerMaterial: {
        type: String,
    },
    outerMaterial: {
        type: String
    },
    modelName: {
        type: String,
    },
    idealFor: {
        type: String,
        enum: ["men", "women"],
    },
    soleMaterial: {
        type: String,
    },
    closure: {
        type: String,
    },
    weight: {
        magnitude: {
            type: Number,
        },
        unit: {
            type: String,
            enum: ['g'],
            default: 'g'
        },
        addInfo: {
            type: String
        }
    },
    upperPattern: {
        type: String,
    },
    packOf: {
        type: Number
    },
    // Care instructions
    careIns: {
        type: String
    }
});

module.exports = adminProductsDBConn.model('FootWear', footwearSchema, "footwears");