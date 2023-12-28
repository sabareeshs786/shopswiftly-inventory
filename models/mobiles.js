const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    price: {
        type: Number,
        required: true,
        unique: false
    },
    brand: {
        type: String,
        required: true,
        unique: false
    },
    category: {
        type: String,
        required: true,
        unique: false
    },
    ram: {
        type: Number,
        required: false,
        unique: false
    },
    storage: {
        type: Number,
        required: false,
        unique: false
    },
    batteryCapacity: {
        type: Number,
        required: false,
        unique: false
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
},{timestamps: true});

mobileSchema.index({ name: 1 }, { unique: true });
mobileSchema.index({ imageUrl: 1 }, { unique: true });

module.exports = mongoose.model('Mobile', mobileSchema);