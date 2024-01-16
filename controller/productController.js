const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const { getGenericFilters, removeEmptyFields, isvalidInputData, strValToNumVal } = require('../utils/utilFunctions');

const Brand = require('../models/brands');
const Category = require('../models/categories');

const Mobile = require('../models/products/electronics/mobiles');
const Laptop = require('../models/products/electronics/laptops');
const Desktop = require('../models/products/electronics/desktop');
const Tablet = require('../models/products/electronics/tablets');
const Topwear = require('../models/products/fashion/clothing_and_accessories/topwear');
const Bottomwear = require('../models/products/fashion/clothing_and_accessories/bottomwear');
const Footwear = require('../models/products/fashion/footwear');

const efUtils = require('../utils/controller/fields-electronics');
const fUtils = require('../utils/controller/fields-fashion');
const { getNextIdCode, resetIdCode } = require('./nextIdCodeController');
const { productsDBConn } = require('../config/dbConnect');

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

        let model;
        let { mongodbQuery, genFields } = getGenericFilters(req);
        let fieldsToRetrieve = [...genFields];

        switch (category) {
            case 'mobiles':
                console.log("Mobiles category");
                model = Mobile;
                break;
            case 'laptops':
                console.log("Laptop category");
                model = Laptop;
                break;
            case 'desktops':
                console.log("Desktops category");
                model = Desktop;
                break;
            case 'tablets':
                console.log("Tablets category");
                model = Tablet;
                break;
            case 'topwears':
                console.log("Topwear category");
                model = Topwear;
                break;
            case 'bottomwears':
                console.log("Bottomwear category");
                model = Bottomwear;
                break;
            case 'footwears':
                console.log("Footwear category");
                model = Footwear;
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        const items = await model.find(mongodbQuery)
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
    let _id;
    let value;
    const session = await productsDBConn.startSession();
    try {
        await session.startTransaction();
        const category = req.params.category;
        const imageFilenames = req.files?.map(file => file.filename);

        const { pname, brand, currency,
            highlights, desc, keywords, sellers,
            availability, bestSeller,
        } = req.body;
        const { mp, sp } = strValToNumVal({ mp: req.body?.mp, sp: req.body?.sp });

        const requiredFields = {
            pname, brand, category,
            sp, mp, keywords,
            imageFilenames
        };
        //Below are the unimportant or uncompulsory fields
        let nonRequiredFields = {
            desc, currency, highlights, availability, sellers, bestSeller
        };
        nonRequiredFields = removeEmptyFields(nonRequiredFields);

        if (nonRequiredFields.highlights)
            nonRequiredFields.highlights = highlights.split(/[,\n]/).map((e) => e.trim());

        if (nonRequiredFields.sellers)
            nonRequiredFields.sellers = sellers.split(/[,\n]/).map((e) => e.trim());

        const offer = Math.floor(((mp - sp) / mp) * 100);

        if (!isvalidInputData(requiredFields))
            throw { code: 400, message: "Invalid input data" };

        const categoryResponse = await Category.find({ category });
        if (!categoryResponse || categoryResponse.length === 0 || categoryResponse.length > 1)
            return res.status(400).json({ message: "Invalid category" });
        const catePath = categoryResponse[0].path;
        if (!catePath)
            throw new Error("Internal server error");

        const brandResponse = await Brand.find({ brand, category });
        if (!brandResponse || brandResponse.length === 0)
            return res.status(400).json({ message: "Invalid brand" });
        const bcCode = brandResponse[0].bcCode;
        if (!bcCode)
            throw new Error("Internal server error");

        let model;
        let fields = { ...requiredFields, ...nonRequiredFields, imageFilenames, offer, catePath, bcCode };

        switch (category) {
            case 'mobiles':
                model = Mobile;
                fields = { ...fields, ...efUtils.getMobileFields(req) };
                break;
            case 'laptops':
                model = Laptop;
                fields = { ...fields, ...efUtils.getLaptopFields(req) };
                break;
            case 'desktops':
                model = Desktop;
                fields = { ...fields, ...efUtils.getDesktopFields(req) };
                break;
            case 'tablets':
                model = Tablet;
                fields = { ...fields, ...efUtils.getTabletFields(req) };
                break;
            case 'topwears':
                model = Topwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getTopwearFields(req) };
                break;
            case 'bottomwears':
                model = Bottomwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getBottomWearFields(req) };
                break;
            case 'footwears':
                model = Footwear;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getFootWearFields(req) };
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        const { skuid, id } = await getNextIdCode("skuid");
        _id = id;
        value = skuid;
        const newProduct = new model({ ...fields, skuid });
        await newProduct.save();

        await session.commitTransaction();

        res.status(201).json({ message: 'Product saved successfully' });
    } catch (error) {
        await session.abortTransaction();
        await resetIdCode(_id, "skuid", value);
        console.error(error);
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate brand name and category" });
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        if (session) {
            await session.endSession();
        }
    }
}

module.exports = { getProducts, getMinMax, getMetaDataForPagination, getProduct, addProduct };