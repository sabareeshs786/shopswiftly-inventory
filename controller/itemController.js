const url = require('url');
const querystring = require('querystring');

const Mobile = require('../models/mobiles');

const getItems = async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);

    const category = req.params.category || "mobiles";
    const preview = req.query.preview ?
        String(req.query.preview).toLowerCase() == "true"
            ? true : String(req.query.preview).toLowerCase() == "false" ?
                false : true
        : true;
    const brand = req.query.brand?.split(',') || ["apple"];
    const sort = req.query.sort || "low-to-high";
    const sortOrder = {}
    sortOrder[sort] = 1;
    const minPrice = queryParams['min-price'] || '';
    const maxPrice = queryParams['max-price'] || '';
    let mongodbQuery = {};
    let priceConditions = [];
    if (Boolean(minPrice) && Boolean(maxPrice)) {
        priceConditions.push({ price: { $gte: minPrice } });
        priceConditions.push({ price: { $lte: maxPrice } });
    }
    else if (Boolean(minPrice)) {
        priceConditions.push({ price: { $gte: minPrice } })
    }
    else if (Boolean(maxPrice)) {
        priceConditions.push({ price: { $lte: maxPrice } });
    }
    mongodbQuery = priceConditions.length > 0 ? { $and: priceConditions } : {};
    mongodbQuery.brand = { $in: brand };

    if (category == "mobiles") {
        try {
            if (preview) {
                const items = await Mobile.find(mongodbQuery).limit(5).sort(sortOrder);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            } else {
                const items = await Mobile.find(mongodbQuery).limit(20).sort(sortOrder);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const getMinMax = async (req, res) => {
    const category = req.params.category || "mobiles";
    const brand = req.query.brand?.split(',') || ["apple"];
    if (category.toLowerCase() == "mobiles") {
        try {
            const mongodbDocs = await Mobile.find({ brand: { $in: brand } });
            const mongodbDocIds = mongodbDocs.map(doc => doc._id);
            const result = await Mobile.aggregate([
                {
                    $match: {
                        _id: { $in: mongodbDocIds }
                    }
                },
                {
                    $group: {
                        _id: null,
                        minValue: { $min: "$price" },
                        maxValue: { $max: "$price" }
                    }
                }]);
            const { minValue, maxValue } = result[0];
            console.log('Minimum Value:', minValue);
            console.log('Maximum Value:', maxValue);
            res.json({ minValue, maxValue });
        } catch (error) {
            console.log(error);
        }
    }
}

const getAllBrands = async (req, res) => {
    const category = req.params.category || "mobiles";
    if (category.toLowerCase() == "mobiles") {
        try {
            const brands = await Mobile.distinct("brand");
            res.json(brands);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { getItems, getMinMax, getAllBrands };