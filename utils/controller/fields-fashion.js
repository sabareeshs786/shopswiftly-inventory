const { removeEmptyFields } = require('../utilFunctions');

const getGenericFields = (req) => {
    const { color, fabric, packOf, styleCode, idealFor, gender, size,
        pattern, suitableFor, reversible, fabricCare, netQuantity, addDet,
        sometext, manufacturing, packaging, _import } = req.body;
    const fields = {
        color,
        fabric,
        packOf,
        styleCode,
        idealFor,
        gender,
        size,
        pattern,
        suitableFor,
        reversible,
        fabricCare,
        netQuantity,
        addDet,
        addInfo: {
            sometext,
            manufacturing,
            packaging,
            _import
        }
    }
    return removeEmptyFields(fields);
}

const getTopwearFields = (req) => {
    const { subcate, sleeveStyle, sleeveLength, theme, fit, neckType,
        collar, hem } = req.body;
    const fields = {
        subcate,
        sleeve: {
            style: sleeveStyle,
            _length: sleeveLength
        },
        theme,
        fit,
        neckType,
        collar,
        hem
    }
    return removeEmptyFields(fields);
}

const getBottomWearFields = (req) => {
    const { subcate } = req.body;
    const fields = {
        subcate
    }
    return removeEmptyFields(fields);
}

const getFootWearFields = (req) => {
    const { subcate, occasion, gender, size, color, innerMaterial,
        outerMaterial, modelName, idealFor, soleMaterial, closure,
        weightMagnitude, weightUnit, weightAddInfo, upperPattern,
        packOf, careIns } = req.body;
    const fields = {
        subcate,
        occasion,
        gender,
        size,
        color,
        innerMaterial,
        outerMaterial,
        modelName,
        idealFor,
        soleMaterial,
        closure,
        weight: {
            magnitude: weightMagnitude,
            unit: weightUnit,
            addInfo: weightAddInfo
        },
        upperPattern,
        packOf,
        careIns
    }

    return removeEmptyFields(fields);
}

module.exports = { getGenericFields, getTopwearFields, getBottomWearFields, getFootWearFields };