const mongoose = require('mongoose');
const { commonFields } = require('../../../utils/fieldUtils');
const Schema = mongoose.Schema;

const laptopSchema = new Schema({
    ...commonFields,
    
});