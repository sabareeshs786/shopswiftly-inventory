const mongoose = require('mongoose');
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
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
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
});

module.exports = mongoose.model('AdminEditor', adminEditorSchema, 'admineditors');