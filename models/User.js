const mongoose = require('mongoose');
const { loginDBConn } = require('../config/dbConnect');
const Schema = mongoose.Schema;

const adminEditorSchema = new Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    phno:{
        type: Number,
        required: false,
        unique: true
    },
    roles: {
        Editor: {
            type: Number,
            default: 1984078
        },
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false,
    }
}, {timestamps: true});

adminEditorSchema.index({email: 1}, {unique: true});
adminEditorSchema.index({phno: 1}, {unique: true});

module.exports = loginDBConn.model('AdminEditor', adminEditorSchema, 'admineditors');