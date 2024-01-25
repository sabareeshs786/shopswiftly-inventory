const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { commonFields, commonFieldsUser } = require('../../../utils/models/fieldUtils');
const { userProductsDBConn } = require('../../../config/dbConnect');

const tabletSchema = new Schema({
    ...commonFields,
    ...commonFieldsUser,
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
            idealUsage: {
                type: [String]
            }
        },
        display: {
            screenSize: {
                size: {
                    type: Number,
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
            name: {
                type: String
            },
            version:{
                type: Number
            }
        },
        processor: {
            brand: {
                type: String
            },
            model: {
                type: String
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
    warranty: {
        period: {
            type: Number
        }
    }
}, { timestamps: true });

module.exports = userProductsDBConn.model('Tablet', tabletSchema);