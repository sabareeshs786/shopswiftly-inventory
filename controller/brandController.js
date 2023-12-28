const url = require('url');
const querystring = require('querystring');

const Brand = require('../models/brands');

const getBrands = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const page = Number.parseInt(queryParams['page'] || '1');
        const pageSize = Number.parseInt(queryParams['pageSize'] || '5');
        const skip = (page - 1) * pageSize;

        const dbResponse = await Mobile.find().skip(skip).limit(pageSize);
        if (!dbResponse) return res.status(204).json({ 'message': `No data found` });
        res.json(dbResponse);
    } catch (error) {
        res.send(500);
    }
}

const addBrand = async (req, res) => {
    try {
        const { brand, category }= req.body;
        if (!isvalidInputData({ brand, category })) {
            return res.send(400).json({ message: "Invalid input data" });
        }
        const newBrand = new Brand({ brand, category });
        const dbResponse = await newBrand.save();
        res.json({ "message": `${brand} and ${category} combination saved successfully` });
    } catch (error) {
        if (dbResponse.code === 11000) {
            return res.send(400).json({ message: "Duplicate brand name and category" });
        }
        res.send(500).json({message: "Error occurred"});
    }
}

const updateBrand = async (req, res) => {
    try {
        const { brand, category, id } = req.body;
        if (!isvalidInputData({ brand, category, id })) {
            return res.send(400).json({ message: "Invalid input data" });
        }
        const dbResponse = await Brand.findByIdAndUpdate(id, { $set: { brand, category } }, {new: true});
        if(dbResponse)
            return res.send(201).json({message: `Update successful`});
        else
            return res.send(400).json({message: "Data not found"});
    } catch (error) {
        if (dbResponse.code === 11000)
            return res.send(400).json({ message: "Duplicate brand name and category" });
        res.send(500).json({message: "Error occurred"});
    }
}

const deleteBrand = async (req, res) => {
    try {
        const id = req.body.id;
        const dbResponse = Brand.findByIdAndDelete(id);
        if (!dbResponse) return res.send(404).json({ 'message': 'Not Found' });
        else
            return res.json({ 'message': `Deleted Successfully!` });
    } catch (error) {
        res.send(500).json({ message: "Can't delete" });
    }
}

module.exports = { getBrands };