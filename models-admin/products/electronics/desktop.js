const mongoose = require('mongoose');
const { commonFields, commonFieldsAdmin } = require('../../../utils/models/fieldUtils');
const { adminProductsDBConn } = require('../../../config/dbConnect');
const Schema = mongoose.Schema;

const desktopSchema = new Schema({
    ...commonFields,
    ...commonFieldsAdmin,
    specifications: {
        general: {
            salesPackage: {
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
            hdd: {
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
        warranty: {
            summary: {
                type: String
            },
            serviceType: {
                type: String
            },
            domesticWarrenty: {
                type: Number
            }
        }
    },
});

module.exports = adminProductsDBConn.model('Desktop', desktopSchema);