const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mobileSchema = new Schema({
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
    specifications: {
        general: {
            modelNo: {
                type: String,
                required: true
            },
            modelName: {
                type: String,
                required: true
            },
            color: {
                type: String
            },
        },
        display: {
            screenSize: {
                size: {
                    type: [Number], // [width, height]
                    required: true
                },
                unit: {
                    type: String,
                    enum: ['inch', 'cm', 'mm'],
                    default: 'inch'
                }
            },
            resolution: {
                type: [Number]
            },
            resolutionType: {
                type: String
            },
        },
        os: {
            type: String
        },
        processor: {
            brand: {
                type: String
            },
            model: {
                type: String
            },
            numberOfCores: {
                type: Number
            },
            clockSpeed: {
                type: Number
            }
        },
        memoryAndStorage: {
            ram: {
                size: {
                    type: Number,
                    required: true
                },
                unit: {
                    type: String,
                    enum: ['GB', 'MB'],
                    default: 'GB'
                }
            },
            internalStorage: {
                size: {
                    type: Number,
                    required: true
                },
                unit: {
                    type: String,
                    enum: ['GB', 'MB'],
                    default: 'GB'
                }
            },
        },
        camera: {
            front: {
                type: [Number],
            },
            rear: {
                type: [Number],
            }
        },
        batteryCapacity: {
            size: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                enum: ['mAh'],
                default: 'mAh'
            }
        },
        networkType: {
            type: String
        },
        simType: {
            type: String
        }
    },
    speciality: {
        type: String
    },
    features: {
        type: String
    },
    browseType: {
        type: String,
        enum: ['Smartphones', 'Featured mobiles', 'Tablets'],
        default: 'Smartphones'
    },
    manufacturerWarranty: {
        type: String
    },
    inBoxWarrenty: {
        type: String
    }
}, { timestamps: true });

mobileSchema.index({ name: 1 }, { unique: true });
mobileSchema.index({ imageUrl: 1 }, { unique: true });

module.exports = mongoose.model('Mobile', mobileSchema);