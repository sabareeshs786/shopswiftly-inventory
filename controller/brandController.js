const url = require('url');
const querystring = require('querystring');
const { isvalidInputData } = require('../utils/utilFunctions');
const Brand = require('../models/brands');
const { getNextIdCode, resetIdCode } = require('./nextIdCodeController');
const { productsDBConn } = require('../config/dbConnect');
const Category = require('../models/categories');

const getBrands = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const page = Number.parseInt(queryParams['page'] || '1');
        const pageSize = Number.parseInt(queryParams['pageSize'] || '5');
        const skip = (page - 1) * pageSize;
        const fields = ["-_id", "bcCode", "brand", "category"]
        const brands = await Brand.find().select(fields.join(' ')).skip(skip).limit(pageSize);
        const totalCount = await Brand.countDocuments();
        if (!brands || brands.length === 0) return res.status(204).json({ 'message': `No data found` });
        return res.json({ brands, totalCount });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching brands" });
    }
}

const getBrandsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const brands = await Brand.find({ category });
        res.json(brands);
    } catch (error) {
        console.log(error);
    }
}

const addBrand = async (req, res) => {
    let _id;
    let value;
    const session = await productsDBConn.startSession();
    try {
        await session.startTransaction();
        const { brand, category } = req.body;
        if (!isvalidInputData({ brand, category })) {
            throw { code: 400, message: "Invalid input data" };
        }
        const cateRes = await Category.find({ category: category.toLowerCase() });
        if (!cateRes || cateRes.length === 0)
            throw { code: 400, message: "Entered category doesn't exist" }
        const { bcCode, id } = await getNextIdCode("bcCode");
        _id = id;
        value = bcCode;
        const newBrand = new Brand({ bcCode, brand: brand.toLowerCase(), category: category.toLowerCase() });
        await newBrand.save();

        await session.commitTransaction();

        return res.json({ message: `${brand} and ${category} combination saved successfully` });
    } catch (error) {
        await session.abortTransaction();
        await resetIdCode(_id, "bcCode", value);
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate brand name and category" });
        else if (error.code === 400)
            return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: "Error occurred" });
    }
    finally {
        if (session) {
            session.endSession();
        }
    }
};

const updateBrand = async (req, res) => {
    try {
        const { brand, category, bcCode } = req.body;
        console.log({brand, category, bcCode});
        if (!isvalidInputData({ brand, category, bcCode }))
            throw { code: 400, message: "Invalid input data" };
        const cateRes = await Category.find({ category: category });
        if (!cateRes || cateRes.length === 0)
            throw { code: 400, message: "Entered category doesn't exist" }

        const dbResponse = await Brand.updateOne({ bcCode: bcCode }, { $set: { brand, category } });
        if (dbResponse && dbResponse.modifiedCount !== 0)
            return res.status(201).json({ message: `Update successfull` });
        res.status(400).json({ message: "Same data entered" });

    } catch (error) {
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate brand name and category" });
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        res.status(500).json({ message: "Unknown error occurred" });
    }
}

const deleteBrand = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const bcCode = queryParams['bcCode'];
        if (!isvalidInputData({ bcCode }))
            throw { code: 400, message: "Invalid input data" };
        const dbResponse = await Brand.deleteOne({bcCode});
        if (!dbResponse) return res.status(404).json({ 'message': 'Data not Found' });
        else
            return res.json({ 'message': `Deleted Successfully!` });
    } catch (error) {
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: "Can't delete" });
    }
}

module.exports = { getBrands, addBrand, updateBrand, deleteBrand, getBrandsByCategory };