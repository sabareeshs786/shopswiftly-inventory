const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MobileSchema = {
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
    price : {
        type: Number,
        required: true,
        unique: false
    },
    brand: {
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
}

module.exports = mongoose.model('Mobile', MobileSchema);