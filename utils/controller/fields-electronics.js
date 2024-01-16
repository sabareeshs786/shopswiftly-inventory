const { removeEmptyFields, strValToNumVal, isvalidInputData, strValToNumArr } = require('../utilFunctions');

const getMobileFields = (req) => {
    const {
        modelNo, modelName, color,
        displaySizeUnit, resolutionType, os,
        pbrand, pmodel, 
        ramUnit, storageUnit,
        primaryCamera, secondaryCamera,
        networkType, simType, speciality, features,
        manufacturerWarranty, inBoxWarrenty
    } = req.body;
    const numVal = {displaySize: req.body?.displaySize, 
        resolutionWidth: req.body?.resolutionWidth, 
        resolutionHeight: req.body?.resolutionHeight, 
        pnoOfCores: req.body?.pnoOfCores, 
        pClockSpeed: req.body?.pClockSpeed,
        ramSize: req.body?.ramSize,
        storageSize: req.body?.storageSize,
        batteryCapacity: req.body?.batteryCapacity
    }
    const {displaySize, 
        resolutionWidth, resolutionHeight,
        pnoOfCores, pClockSpeed, ramSize, storageSize, batteryCapacity} = strValToNumVal(numVal);
    const requiredFields = {
        modelNo, modelName, displaySize, resolutionWidth, resolutionHeight, ramSize, storageSize
    };
    
    if (!isvalidInputData(requiredFields))
        throw { code: 400, message: "Invalid input data" };

    const fields = {
        specifications: {
            general: {
                modelNo,
                modelName,
                color
            },
            display: {
                displaySize: {
                    size: displaySize,
                    unit: displaySizeUnit
                },
                resolution: [resolutionWidth, resolutionHeight],
                resolutionType
            },
            os,
            processor: {
                brand: pbrand,
                model: pmodel,
                numberOfCores: pnoOfCores,
                clockSpeed: pClockSpeed
            },
            memoryAndStorage: {
                ram: {
                    size: ramSize,
                    unit: ramUnit
                },
                internalStorage: {
                    size: storageSize,
                    unit: storageUnit
                }
            },
            camera: {
                primary: strValToNumArr(primaryCamera),
                secondary: strValToNumArr(secondaryCamera)
            },
            batteryCapacity: {
                size: batteryCapacity,
            },
            networkType,
            simType
        },
        speciality,
        features,
        manufacturerWarranty,
        inBoxWarrenty
    };

    return removeEmptyFields(fields);
}

const getLaptopFields = (req) => {
    const {
        salesPackage, modelno, modelName, partNo,
        color, series, type, suitableFor, batteryCell,
        pbrand, pname, pmodel, pnoOfCores, pClockSpeed,
        pvariant, pgraphicProcessor, ramSize, ramUnit,
        ramType, cacheSize, cacheUnit, ssdContains,
        ssdSize, ssdUnit, emmcContains, emmcSize, emmcUnit,
        internalStorageSize, internalStorageUnit, osName,
        supportedOses, micIn, usbPorts, touchScreen,
        screenSize, screenSizeUnit, resolution, screenType,
        speakers, internalMic, webcamera, batteryCapacity,
        batteryCapacityUnit, wsummary, wserviceType, domesticWarranty
    } = req.body;

    const fields = {
        specifications: {
            general: {
                salesPackage,
                modelno,
                modelName,
                partNo,
                color,
                series,
                type,
                suitableFor,
                batteryCell
            },
            processor: {
                brand: pbrand,
                name: pname,
                model: pmodel,
                numberOfCores: pnoOfCores,
                clockSpeed: pClockSpeed,
                variant: pvariant,
                graphicProcessor: pgraphicProcessor
            },
            memoryAndStorage: {
                ram: {
                    size: ramSize,
                    unit: ramUnit,
                    type: ramType
                },
                cache: {
                    size: cacheSize,
                    unit: cacheUnit
                },
                ssd: {
                    contains: ssdContains,
                    size: ssdSize,
                    unit: ssdUnit
                },
                emmcStorage: {
                    contains: emmcContains,
                    size: emmcSize,
                    unit: emmcUnit
                },
                internalStorage: {
                    size: internalStorageSize,
                    unit: internalStorageUnit
                }
            },
            os: {
                name: osName,
                supported: supportedOses
            },
            portAndSlot: {
                micIn,
                usbPorts
            },
            display: {
                touchScreen,
                screenSize: {
                    size: screenSize,
                    unit: screenSizeUnit
                },
                resolution,
                screenType
            },
            audio: {
                speakers,
                internalMic
            },
            webcamera,
            batteryCapacity: {
                size: batteryCapacity,
                unit: batteryCapacityUnit
            },
            warranty: {
                summary: wsummary,
                serviceType: wserviceType,
                domesticWarranty
            }
        }
    }

    return removeEmptyFields(fields);
}

const getDesktopFields = (req) => {
    const { salesPackage, modelName, modelNo, partNo, color, series,
        pbrand, pname, pmodel, pnoOfCores, pClockSpeed, pgraphicProcessor,
        ramSize, ramUnit, ramType, cacheSize, cacheUnit, ssdContains,
        ssdSize, ssdUnit, hddContains, hddSize, hddUnit, emmcContains,
        emmcSize, emmcUnit, osName, supportedOses, micIn, usbPorts,
        touchScreen, screenSize, screenSizeUnit, resolution, screenType,
        speakers, internalMic, webcamera, wsummary, wserviceType, domesticWarranty
    } = req.body;
    const fields = {
        specifications: {
            general: {
                salesPackage,
                modelName,
                partNo,
                color,
                series
            },
            processor: {
                brand: pbrand,
                name: pname,
                model: pmodel,
                numberOfCores: pnoOfCores,
                clockSpeed: pClockSpeed,
                graphicProcessor: pgraphicProcessor
            },
            memoryAndStorage: {
                ram: {
                    size: ramSize,
                    unit: ramUnit,
                    type: ramType
                },
                cache: {
                    size: cacheSize,
                    unit: cacheUnit
                },
                ssd: {
                    contains: ssdContains,
                    size: ssdSize,
                    unit: ssdUnit
                },
                hdd: {
                    contains: hddContains,
                    size: hddSize,
                    unit: hddUnit
                },
                emmcStorage: {
                    contains: emmcContains,
                    size: emmcSize,
                    unit: emmcUnit
                }
            },
            os: {
                name: osName,
                supported: supportedOses
            },
            portAndSlot: {
                micIn,
                usbPorts
            },
            display: {
                touchScreen,
                screenSize: {
                    size: screenSize,
                    unit: screenSizeUnit
                },
                resolution,
                screenType
            },
            audio: {
                speakers,
                internalMic
            },
            webcamera,
            warranty: {
                summary: wsummary,
                serviceType: wserviceType,
                domesticWarranty
            }
        }
    }

    return removeEmptyFields(fields);

}

const getTabletFields = (req) => {
    const { modelNo, modelName, color, idealUsage, screenSize,
        screenSizeUnit, resolution, resolutionType, osName, osVersion,
        pbrand, pmodel, pClockSpeed, ramSize, ramUnit, internalStorageSize,
        internalStorageUnit, pcamera, scamera, batteryCapacity, batteryCapacityUnit,
        networkType, simType, speciality, features, warrantyPeriod
    } = req.body;

    const fields = {
        specifications: {
            general: {
                modelNo,
                modelName,
                color,
                idealUsage
            },
            display: {
                screenSize: {
                    size: screenSize,
                    unit: screenSizeUnit
                },
                resolution: resolution.split(','),
                resolutionType
            },
            os: {
                name: osName,
                version: osVersion
            },
            processor: {
                brand: pbrand,
                model: pmodel,
                clockSpeed: pClockSpeed
            },
            memoryAndStorage: {
                ram: {
                    size: ramSize,
                    unit: ramUnit
                },
                internalStorage: {
                    size: internalStorageSize,
                    unit: internalStorageUnit
                }
            },
            camera: {
                primary: pcamera.split(','),
                secondary: scamera.split(',')
            },
            batteryCapacity: {
                size: batteryCapacity,
                unit: batteryCapacityUnit
            },
            networkType,
            simType
        },

        speciality,
        features,
        warranty: {
            period: warrantyPeriod
        }
    }
    return removeEmptyFields(fields);
}


module.exports = { getMobileFields, getLaptopFields, getDesktopFields, getTabletFields };