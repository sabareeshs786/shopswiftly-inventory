const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { commonFields } = require('../../../utils/fieldUtils');
const topwear = new Schema({
    ...commonFields,
    
});

module.exports = mongoose.model('MensTopWear', topwear, "menstopwear");