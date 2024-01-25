const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
const { getGenericFilters, removeEmptyFields, isvalidInputData, strValToNumVal } = require('../utils/utilFunctions');

const Counter = require('../models-admin/Counter');
const Brand = require('../models-admin/brands');
const Category = require('../models-admin/categories');

const MobileAdmin = require('../models-admin/products/electronics/mobiles');
const LaptopAdmin = require('../models-admin/products/electronics/laptops');
const DesktopAdmin = require('../models-admin/products/electronics/desktop');
const TabletAdmin = require('../models-admin/products/electronics/tablets');
const TopwearAdmin = require('../models-admin/products/fashion/clothing_and_accessories/topwear');
const BottomwearAdmin = require('../models-admin/products/fashion/clothing_and_accessories/bottomwear');
const FootwearAdmin = require('../models-admin/products/fashion/footwear');

const MobileUser = require('../models-user/products/electronics/mobiles');
const LaptopUser = require('../models-user/products/electronics/laptops');
const DesktopUser = require('../models-user/products/electronics/desktop');
const TabletUser = require('../models-user/products/electronics/tablets');
const TopwearUser = require('../models-user/products/fashion/clothing_and_accessories/topwear');
const BottomwearUser = require('../models-user/products/fashion/clothing_and_accessories/bottomwear');
const FootwearUser = require('../models-user/products/fashion/footwear');


const efUtils = require('../utils/controller/fields-electronics');
const fUtils = require('../utils/controller/fields-fashion');
const { adminProductsDBConn, userProductsDBConn } = require('../config/dbConnect');

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
                model = MobileAdmin;
                break;
            case 'laptops':
                console.log("Laptop category");
                model = LaptopAdmin;
                break;
            case 'desktops':
                console.log("Desktops category");
                model = DesktopAdmin;
                break;
            case 'tablets':
                console.log("Tablets category");
                model = TabletAdmin;
                break;
            case 'topwears':
                console.log("Topwear category");
                model = TopwearAdmin;
                break;
            case 'bottomwears':
                console.log("Bottomwear category");
                model = BottomwearAdmin;
                break;
            case 'footwears':
                console.log("Footwear category");
                model = FootwearAdmin;
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
            const mongodbDocs = await MobileAdmin.find(mongodbQuery);
            const mongodbDocIds = mongodbDocs.map(doc => doc._id);
            const result = await MobileAdmin.aggregate([
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
            const countOfDocs = await MobileAdmin.countDocuments(mongodbQuery);
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
            const item = await MobileAdmin.findById(itemId).exec();
            if (!item) return res.status(204).json({ 'message': `No item found` });
            res.json(item);
        } catch (error) {
            console.log(error);
            res.status(400);
        }
    }

}

const addProduct = async (req, res) => {
    const adminSession = await adminProductsDBConn.startSession();
    const userSession = await userProductsDBConn.startSession();
    await adminSession.startTransaction();
    await userSession.startTransaction();

    try {
        const category = req.params.category;
        const imageFilenames = req.imageFiles?.map(file => file.filename);

        const { pname, brand, currency,
            highlights, desc, keywords, sellers,
            availability, bestSeller,
        } = req.body;
        if (!isvalidInputData({ mp: req.body?.mp, sp: req.body?.sp }))
            throw { code: 400, message: "Invalid input data" };

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

        let modelAdmin;
        let modelUser;
        let fields = { ...requiredFields, ...nonRequiredFields, imageFilenames, offer, catePath, bcCode };

        switch (category) {
            case 'mobiles':
                modelAdmin = MobileAdmin;
                modelUser = MobileUser;
                fields = { ...fields, ...efUtils.getMobileFields(req) };
                break;
            case 'laptops':
                modelAdmin = LaptopAdmin;
                modelUser = LaptopUser;
                fields = { ...fields, ...efUtils.getLaptopFields(req) };
                break;
            case 'desktops':
                modelAdmin = DesktopAdmin;
                modelUser = DesktopUser;
                fields = { ...fields, ...efUtils.getDesktopFields(req) };
                break;
            case 'tablets':
                modelAdmin = TabletAdmin;
                modelUser = TabletUser;
                fields = { ...fields, ...efUtils.getTabletFields(req) };
                break;
            case 'topwears':
                modelAdmin = TopwearAdmin;
                modelUser = TopwearUser;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getTopwearFields(req) };
                break;
            case 'bottomwears':
                modelAdmin = BottomwearAdmin;
                modelUser = BottomwearUser;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getBottomWearFields(req) };
                break;
            case 'footwears':
                modelAdmin = FootwearAdmin;
                modelUser = FootwearUser;
                fields = { ...fields, ...fUtils.getGenericFields(req), ...fUtils.getFootWearFields(req) };
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }
        const counter = await Counter.findOneAndUpdate(
            { field: 'skuid' },
            { $inc: { value: 1 } },
            { new: true, upsert: true, session: adminSession }
        );

        const skuid = counter.value;
        const newProductAdmin = await modelAdmin.create([{ ...fields, skuid }], { session: adminSession });
        const newProductUser = await modelUser.create([{ ...fields, skuid }], { session: userSession });

        await adminSession.commitTransaction();
        await userSession.commitTransaction();
        res.status(201).json({ message: 'Product saved successfully' });
    } catch (error) {
        await adminSession.abortTransaction();
        await userSession.abortTransaction();
        console.error(error);
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate product name" });
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        if (adminSession) {
            adminSession.endSession();
        }
        if(userSession){
            userSession.endSession();
        }

    }
}

module.exports = { getProducts, getMinMax, getMetaDataForPagination, getProduct, addProduct };