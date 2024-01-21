const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, clothingFields, commonFieldsAdmin } = require('../../../../utils/models/fieldUtils');
const { adminProductsDBConn } = require('../../../../config/dbConnect');

const topwearSchema = new Schema({
    ...commonFields,
    ...clothingFields,
    ...commonFieldsAdmin,
    
    // Sub-categories
    subcate: {
        type: String,
        enum: ["t-shirts", "formal-shirts", "casual-shirts", "shirts", "tops"],
        required: true
    },
    sleeve: {
        style: {
            type: String
        },
        _length: {
            type: String,
            enum: ["full", "half"]
        }
    },
    theme: {
        type: String
    },
    fit: {
        type: String,
    },
    neckType: {
        type: String,
    },
    collar: {
        type: String,
    },
    hem: {
        type: String
    },
});

module.exports = adminProductsDBConn.model('TopWear', topwearSchema, "topwears");