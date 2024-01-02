
const getMobileFields = (req) => {
    const {
        modelNo, modelName, color, displaySize, 
        displayUnit, resolution, resolutionType, os, 
        pbrand, pmodel, pnoOfCores, pClockSpeed,
        ramSize, ramUnit, storageSize, storageUnit,
        frontCamera, rearCamera, batteryCapacity, batteryCapacityUnit,
        networkType, simType, speciality, features, browseType, 
        manufacturerWarranty, inBoxWarrenty
    } = req.body;
    
}

module.exports = { getMobileFields };