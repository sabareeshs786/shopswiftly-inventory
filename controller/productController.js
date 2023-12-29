const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const { getNonNullUndefinedProperties } = require('../utils/utilFunctions');
const Mobile = require('../models/products/electronics/mobiles');

const getProducts = async (req, res) => {
    const parsedUrl = url.parse(req.url);
    const queryParams = querystring.parse(parsedUrl.query);
    const category = req.params.category?.toLowerCase() || "mobiles";
    const preview = req.query.preview ? String(req.query.preview).toLowerCase() == "true" ? true : String(req.query.preview).toLowerCase() == "false" ? false : true : true;
    const brand = req.query.brand?.split(',') || ["apple"];
    const minPrice = queryParams['min-price'] || '';
    const maxPrice = queryParams['max-price'] || '';
    const sort = req.query.sort || "low-to-high";
    const sortOrder = {};
    const page = Number.parseInt(queryParams['page'] || '1');
    const pageSize = Number.parseInt(queryParams['pageSize'] || '5');
    const skip = (page - 1) * pageSize;

    if (sort.toLowerCase() == "low-to-high") {
        sortOrder.price = 1
    }
    else if (sort.toLowerCase() == "high-to-low") {
        sortOrder.price = -1;
    }
    else {
        sortOrder.price = 1;
    }

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

    const fieldsToRetrieve = ["_id", "name", "price", "brand", "ram", "storage", "imageUrl"];

    if (category == "mobiles") {
        try {
            if (preview) {
                const items = await Mobile.find(mongodbQuery).select(fieldsToRetrieve.join(' ')).limit(5).sort(sortOrder);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            } else {
                const items = await Mobile.find(mongodbQuery).select(fieldsToRetrieve.join(' ')).skip(skip).limit(pageSize).sort(sortOrder);
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
    let mongodbQuery = {};
    let brand = req.query.brand;
    if (Boolean(brand)) {
        brand = brand?.split(',');
        mongodbQuery.brand = { $in: brand };
    }
    else {
        mongodbQuery = {}
    }
    if (category.toLowerCase() == "mobiles") {
        try {
            const mongodbDocs = await Mobile.find(mongodbQuery);
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

const getMetaDataForPagination = async (req, res) => {
    try {
        const category = req.params.category || "mobiles";
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const brand = queryParams['brand']?.split(',') || ["apple"];
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

        if (category === 'mobiles') {
            const countOfDocs = await Mobile.countDocuments(mongodbQuery);
            if (!countOfDocs) return res.status(204).json({ 'message': `No items found for the category ${category}` });
            res.json({ countOfDocs });
        }
    } catch (error) {
        console.log(error);
    }
}

const getProduct = async (req, res) => {
    const id = req.query.id;
    const category = req.params.category?.toLowerCase() || "mobiles";
    if (category == "mobiles") {
        try {
            const itemId = new mongoose.Types.ObjectId(String(id));
            const item = await Mobile.findById(itemId).exec();
            if (!item) return res.status(204).json({ 'message': `No item found` });
            res.json(item);
        } catch (error) {
            console.log(error);
            res.status(400);
        }
    }

}

const addProduct = async (req, res) => {
    try {
        const { name, description, price, brand, ram, storage, batteryCapacity } = req.body;
        const imageUrl = req.file.filename;
        const notNullUndefined = getNonNullUndefinedProperties({ name, description, price, brand, ram, storage, batteryCapacity, imageUrl });

        const newImage = new Mobile(notNullUndefined);
        await newImage.save();

        res.status(201).json({ message: 'Product saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getProducts, getMinMax, getAllBrands, getMetaDataForPagination, getProduct, addProduct };