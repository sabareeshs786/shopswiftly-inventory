const commonFields = {
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        default: null
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // sp - Selling Price
    sp: {
        type: Number,
        required: true,
    },
    mp: {
        type: Number,
        required: true
    },
    offer: {
        type: Number,
    },
    currency: {
        type: String,
        required: true,
        enum: ['INR', 'USD'],
        default: "INR"
    },
    rating: {
        type: Number,
        required: true,
        default: null
    },
    numberOfRatings: {
        type: Number,
        default: 0
    },
    reviews: {
        type: String,
    },
}

module.exports = {commonFields};