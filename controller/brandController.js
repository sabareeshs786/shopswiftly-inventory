const url = require('url');
const querystring = require('querystring');
const { isvalidInputData } = require('../utils/utilFunctions');
const Brand = require('../models/brands');
const { getNextIdCode } = require('./nextIdCodeController');

const getBrands = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const page = Number.parseInt(queryParams['page'] || '1');
        const pageSize = Number.parseInt(queryParams['pageSize'] || '5');
        const skip = (page - 1) * pageSize;
        const dbResponse = await Brand.find().skip(skip).limit(pageSize);
        if (!dbResponse || dbResponse.length === 0) return res.status(204).json({ 'message': `No data found` });
        return res.json(dbResponse);
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching brands" });
    }
}

const getAllBrands = async (req, res) => {
    try {
        const category = req.params.category;
        let schema;
        switch (category) {
            case 'mobiles':
                schema = Mobile;
                break;
            case 'laptops':
                schema = Laptop;
                break;
            case 'desktops':
                schema = Desktop;
                break;
            case 'tablets':
                schema = Tablet;
                break;
            case 'topwears':
                schema = Topwear;
                break;
            case 'bottomwears':
                schema = Bottomwear;
                break;
            case 'footwears':
                schema = Footwear;
                break;
            default:
                console.log("No valid category");
                return res.status(400).json({ message: "Invalid category" });
        }

        const bcCodes = await schema.distinct("bcCode");
        console.log(bcCodes);
        const brands = await Brand.find({ bcCode: { $in: bcCodes } });
        res.json(brands);
    } catch (error) {
        console.log(error);
    }
}

const addBrand = async (req, res) => {
    try {
        const { brand, category } = req.body;
        if (!isvalidInputData({ brand, category })) {
            throw { code: 400, message: "Invalid input data" };
        }
        const bcCode = getNextIdCode("bcCode");
        const newBrand = new Brand({ bcCode, brand, category });
        const dbResponse = await newBrand.save();
        return res.json({ message: `${brand} and ${category} combination saved successfully` });
    } catch (error) {
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate brand name and category" });
        else if (error.code === 400)
            return res.status(400).json({ message: "Invalid Input Data" });
        return res.status(500).json({ message: "Error occurred" });
    }
};

const updateBrand = async (req, res) => {
    try {
        const { brand, category, id } = req.body;
        if (!isvalidInputData({ brand, category, id }))
            throw { code: 400, message: "Invalid input data" };

        const dbResponse = await Brand.updateOne({ _id: id }, { $set: { brand, category } });
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
        const id = queryParams['id'];
        if (!isvalidInputData({ id }))
            throw { code: 400, message: "Invalid input data" };
        const dbResponse = await Brand.findByIdAndDelete(id);
        if (!dbResponse) return res.status(404).json({ 'message': 'Data not Found' });
        else
            return res.json({ 'message': `Deleted Successfully!` });
    } catch (error) {
        if (error.code === 400)
            return res.status(400).json({ message: error.message });
        return res.status(500).json({ message: "Can't delete" });
    }
}

module.exports = { getBrands, addBrand, updateBrand, deleteBrand, getAllBrands};