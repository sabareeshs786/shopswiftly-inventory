const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, clothingFields } = require('../../../../utils/models/fieldUtils');
const { userProductsDBConn } = require('../../../../config/dbConnect');

const bottomwearSchema = new Schema({
    ...commonFields,
    ...clothingFields,

    // Sub-categories
    subcate: {
        type: String,
        enum: ["jeans"],
        required: true
    },
});

module.exports = userProductsDBConn.model('BottomWear', bottomwearSchema, "bottomwears");