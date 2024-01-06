const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, clothingFields } = require('../../../../utils/models/fieldUtils');
const { productsDBConn } = require('../../../../config/dbConnect');

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

module.exports = productsDBConn.model('BottomWear', bottomwearSchema, "bottomwears");