const commonFields = {
    skuid: {
        type: Number,
        required: true,
        unique: true
    },
    imageUrl: {
        type: [String],
        required: true,
        unique: true
    },
    // Display name
    disname: {
        type: String,
        required: true,
        unique: true
    },
    // Description of the product
    desc: {
        type: String,
        required: true,
        default: null
    },
    // Brand-Category code
    bcCode: {
        type: String,
        required: true,
    },
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
        default: 0
    },
    noOfRatings: {
        type: Number,
        default: 0
    },
    reviews: {
        type: String,
    },
    noOfReviews: {
        type: Number
    },
    keywords: {
        type: String,
        required: true
    },
    highlights: {
        type: [String],
        required: false,
        default: null
    },
}

module.exports = {commonFields};