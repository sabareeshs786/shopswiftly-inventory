const commonFields = {
    skuid: {
        type: Number,
        required: true,
        unique: true
    },
    imageFilenames: {
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
        type: Number,
        required: true,
    },
    // Category path
    catePath: {
        type: String,
        required: true
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
        type: Number,
        default: 0
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
    availability: {
        type: Boolean,
    },
    sellers: {
        type: [String],
    },
    bestSeller: {
        type: Boolean,
        default: false
    }
}

const clothingFields = {
    
    color: {
        type: String
    },
    fabric: {
        type: String,
    },
    packof: {
        type: Number,
    },
    styleCode: {
        type: String,
    },
    idealFor: {
        type: [String],
        enum: ["men", "women", "men & women", "kids"]
    },
    gender: {
        type: String,
        enum: ["men", "women"]
    },
    size: {
        type: [String]
    },
    pattern: {
        type: String,
    },
    suitableFor: {
        type: String
    },
    reversible: {
        type: Boolean
    },
    fabricCare: {
        type: String
    },
    netQuantity: {
        type: Number
    },
    // Additional details
    addDet: {
        type: String
    },
    // Additional informatio
    addInfo: {
        sometext: {
            type: String,
        },
        manufacturing: {
            type: String,
        },
        packaging: {
            type: String,
        },
        _import: {
            type: String,
        }
    },
}

module.exports = { commonFields, clothingFields };