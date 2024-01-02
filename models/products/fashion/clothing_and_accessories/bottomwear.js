const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields } = require('../../../../utils/fieldUtils');

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

module.exports = mongoose.model('BottomWear', bottomwearSchema, "bottomwears");