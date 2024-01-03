const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const { getGenericFilters } = require('../utils/utilFunctions');
const Brand = require('../models/brands');
const Mobile = require('../models/products/electronics/mobiles');
const Laptop = require('../models/products/electronics/laptops');
const Desktop = require('../models/products/electronics/desktop');
const Tablet = require('../models/products/electronics/tablets');
const Topwear = require('../models/products/fashion/clothing_and_accessories/topwear');
const Bottomwear = require('../models/products/fashion/clothing_and_accessories/bottomwear');
const Footwear = require('../models/products/fashion/footwear');

const efUtils = require('../utils/controller/fields-electronics');
const fUtils = require('../utils/controller/fields-fashion');
const { getNextIdCode } = require('./nextIdCodeController');

const getProducts = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const category = req.params.category;
        const preview = req.query.preview !== "false";
        const sort = req.query.sort || "low-to-high";
        const sortOrder = {};
        const page = Number.parseInt(queryParams['page'] || '1');
        const pageSize = Number.parseInt(queryParams['pageSize'] || '5');
        const skip = (page - 1) * pageSize;
        sortOrder.price = sort == "high-to-low" ? -1 : 1;

        let schema;
        let { mongodbQuery, genFields } = getGenericFilters(req);
        let fieldsToRetrieve = [...genFields];

        switch (category) {
            case 'mobiles':
                console.log("Mobiles category");
                schema = Mobile;
                break;
            case 'laptops':
                console.log("Laptop category");
                schema = Laptop;
                break;
            case 'desktops':
                console.log("Desktops category");
                schema = Desktop;
                break;
            case 'tablets':
                console.log("Tablets category");
                schema = Tablet;
                break;
            case 'topwears':
                console.log("Topwear category");
                schema = Topwear;
                break;
            case 'bottomwears':
                console.log("Bottomwear category");
                schema = Bottomwear;
                break;
            case 'footwears':
                console.log("Footwear category");
                schema = Footwear;
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        const items = await schema.find(mongodbQuery)
            .select(fieldsToRetrieve.join(' '))
            .skip(preview ? 0 : skip)
            .limit(preview ? 5 : pageSize)
            .sort(sortOrder);

        if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
        res.json(items);
    } catch (error) {
        console.log(error);
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
    const session = await mongoose.startSession();
    try {
        const category = req.params.category;
        const { disname, desc, bcCode, catePath,
            sp, mp, currency, keywords, highlights,
            availability, sellers } = req.body;
        const requiredFields = {
            disname, desc, bcCode, catePath,
            sp, mp, currency, keywords, highlights,
            availability, sellers
        };

        if (!isvalidInputData(requiredFields))
            throw { code: 400, message: "Invalid input data" };

        const brandResponse = await Brand.find({ bcCode: bcCode });
        if (!brandResponse || brandResponse.length === 0)
            return res.status(400).json({ message: "Invalid brand-category code" });

        const offer = ((mp - sp) / mp) * 100;
        const skuid = getNextIdCode("skuid");

        const imageUrl = req.file.filename;
        let schema;
        let fields = { requiredFields, imageUrl };

        switch (category) {
            case 'mobiles':
                console.log("Mobiles category");
                schema = Mobile;
                fields = { ...fields, ...efUtils.getMobileFields(req) };
                break;
            case 'laptops':
                console.log("Laptop category");
                schema = Laptop;
                fields = { ...fields, ...efUtils.getLaptopFields(req) };
                break;
            case 'desktops':
                console.log("Desktops category");
                schema = Desktop;
                fields = { ...fields, ...efUtils.getDesktopFields(req) };
                break;
            case 'tablets':
                console.log("Tablets category");
                schema = Tablet;
                fields = { ...fields, ...efUtils.getTabletFields(req) };
                break;
            case 'topwears':
                console.log("Topwear category");
                schema = Topwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getTopwearFields(req) };
                break;
            case 'bottomwears':
                console.log("Bottomwear category");
                schema = Bottomwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getBottomWearFields(req) };
                break;
            case 'footwears':
                console.log("Footwear category");
                schema = Footwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getFootWearFields(req) };
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        await session.withTransaction(async () => {
            const newProduct = new schema(fields);
            await newProduct.save();
        })

        res.status(201).json({ message: 'Product saved successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
}

module.exports = { getProducts, getMinMax, getMetaDataForPagination, getProduct, addProduct };