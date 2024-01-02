const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const { getNonNullUndefinedProperties } = require('../utils/utilFunctions');
const Mobile = require('../models/products/electronics/mobiles');
const Laptop = require('../models/products/electronics/laptops');
const Desktop = require('../models/products/electronics/desktop');
const Tablet = require('../models/products/electronics/tablets');
const Topwear = require('../models/products/fashion/clothing_and_accessories/topwear');
const Bottomwear = require('../models/products/fashion/clothing_and_accessories/bottomwear');
const Footwear = require('../models/products/fashion/footwear');

const efUtils = require('../utils/controller/electronics');
const fUtils = require('../utils/controller/fashion');

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
        const category = req.params.category;
        const { skuid, disname, desc, bcCode, catePath,
            sp, mp, offer, currency, rating, noOfRatings,
            reviews, noOfReviews, keywords, highlights,
            availability, sellers } = req.body;
        const requiredFields = {
            skuid, disname, desc, bcCode, catePath,
            sp, mp, offer, currency, rating, noOfRatings,
            reviews, noOfReviews, keywords, highlights,
            availability, sellers
        };
        const imageUrl = req.file.filename;
        let schema;
        let fields = {requiredFields, imageUrl};

        if (!isvalidInputData(requiredFields))
            throw { code: 400, message: "Invalid input data" };

        switch (category) {
            case 'mobiles':
                console.log("Mobiles category");
                schema = Mobile;
                fields = {...fields, ...efUtils.getMobileFields(req)};
                break;
            case 'laptops':
                console.log("Laptop category");
                schema = Laptop;
                fields = {...fields, ...efUtils.getLaptopFields(req)};
                break;
            case 'desktops':
                console.log("Desktops category");
                schema = Desktop;
                fields = {...fields, ...efUtils.getDesktopFields(req)};
                break;
            case 'tablets':
                console.log("Tablets category");
                schema = Tablet;
                fields = {...fields, ...efUtils.getTabletFields(req)};
                break;
            case 'topwears':
                console.log("Topwear category");
                schema = Topwear;
                fields = {...fields, ...fUtils.getGenericFields(req), ...fUtils.getTopwearFields(req)};
                break;
            case 'bottomwears':
                console.log("Bottomwear category");
                schema = Bottomwear;
                fields = {...fields, ...fUtils.getGenericFields(req), ...fUtils.getBottomWearFields(req)};
                break;
            case 'footwears':
                console.log("Footwear category");
                schema = Footwear;
                fields = {...fields, ...fUtils.getGenericFields(req), ...fUtils.getFootWearFields(req)};
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        const newProduct = new schema(fields);
        await newProduct.save();

        res.status(201).json({ message: 'Product saved successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { getProducts, getMinMax, getAllBrands, getMetaDataForPagination, getProduct, addProduct };