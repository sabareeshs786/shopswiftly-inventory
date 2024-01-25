const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, clothingFields, commonFieldsUser } = require('../../../../utils/models/fieldUtils');
const { userProductsDBConn } = require('../../../../config/dbConnect');

const bottomwearSchema = new Schema({
    ...commonFields,
    ...clothingFields,
    ...commonFieldsUser,

    // Sub-categories
    subcate: {
        type: String,
        enum: ["jeans"],
        required: true
    },
});

module.exports = userProductsDBConn.model('BottomWear', bottomwearSchema, "bottomwears");