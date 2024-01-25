const mongoose = require('mongoose');
const { commonFields, commonFieldsUser } = require('../../../utils/models/fieldUtils');
const { userProductsDBConn } = require('../../../config/dbConnect');
const Schema = mongoose.Schema;

const laptopSchema = new Schema({
    ...commonFields,
    ...commonFieldsUser,
    specifications: {
        general: {
            salesPackage: {
                type: String,
                required: true
            },
            modelNo: {
                type: String,
                required: true
            },
            modelName: {
                type: String,
                required: true
            },
            partNo: {
                type: String
            },
            color: {
                type: String
            },
            series: {
                type: String
            },
            type: {
                type: String
            },
            suitableFor: {
                type: String
            },
            batteryCell: {
                type: Number
            }
        },
        processor: {
            brand: {
                type: String
            },
            name: {
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
            },
            variant: {
                type: String
            },
            graphicProcessor: {
                type: String
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
                },
                type: {
                    type: String
                }
            },
            cache: {
                size: {
                    type: Number,
                    required: true
                },
                unit: {
                    type: String,
                    enum: ['KB', 'MB'],
                    default: 'MB'
                }
            },
            ssd: {
                contains: {
                    type: Boolean,
                    default: false
                },
                size: {
                    type: Number,
                },
                unit: {
                    type: String,
                    enum: ['GB', 'MB'],
                    default: 'GB'
                },
            },
            emmcStorage: {
                contains: {
                    type: Boolean,
                    default: false
                },
                size: {
                    type: Number,
                },
                unit: {
                    type: String,
                    enum: ['GB', 'MB'],
                    default: 'GB'
                },
            },
            internalStorage: {
                size: {
                    type: Number,
                },
                unit: {
                    type: String,
                    enum: ['GB', 'MB', 'TB'],
                    default: 'GB'
                }
            },
        },
        os: {
            name: {
                type: String
            },
            supported: {
                type: [String]
            }
        },
        portAndSlot: {
            micIn: {
                type: Boolean
            },
            usbPorts: {
                type: String
            }
        },
        display: {
            touchscreen: {
                type: Boolean
            },
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
            screenType: {
                type: String
            },
        },
        audio: {
            speakers: {
                type: String
            },
            internalMic: {
                type: String
            }
        },
        webcamera: {
            type: Number
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
        warranty: {
            summary: {
                type: String
            },
            serviceType: {
                type: String
            },
            domesticWarranty: {
                type: Number
            }
        }
    },    uid: {
        
    },
});

module.exports = userProductsDBConn.model('Laptop', laptopSchema);