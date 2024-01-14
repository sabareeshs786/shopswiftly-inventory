const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields } = require('../../../utils/models/fieldUtils');
const { productsDBConn } = require('../../../config/dbConnect');

const mobileSchema = new Schema({
    ...commonFields,
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
            primary: {
                type: [Number],
            },
            secondary: {
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
                required: true,
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

module.exports = productsDBConn.model('Mobile', mobileSchema);