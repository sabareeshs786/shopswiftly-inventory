const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, clothingFields, commonFieldsAdmin } = require('../../../../utils/models/fieldUtils');
const { adminProductsDBConn } = require('../../../../config/dbConnect');

const bottomwearSchema = new Schema({
    ...commonFields,
    ...clothingFields,
    ...commonFieldsAdmin,

    // Sub-categories
    subcate: {
        type: String,
        enum: ["jeans"],
        required: true
    },
});

module.exports = adminProductsDBConn.model('BottomWear', bottomwearSchema, "bottomwears");