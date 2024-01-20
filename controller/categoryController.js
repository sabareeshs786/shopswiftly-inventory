const url = require('url');
const querystring = require('querystring');
const { isvalidInputData } = require('../utils/utilFunctions');
const Category = require('../models-admin/categories');

const getCategories = async (req, res) => {
    try {
        const fields = ["-_id", "category"];
        const categories = await Category.find().select(fields.join(' '));
        if (!categories || categories.length === 0) return res.status(204).json({ 'message': `No data found` });
        return res.json(categories);
    } catch (error) {
        console.log(error);
    }
}

const addCategory = async (req, res) => {
    try {
        const {category, path} = req.body;
        if (!isvalidInputData({ category, path })) {
            throw { code: 400, message: "Invalid input data" };
        }
        const newCategory = new Category({ category, path });
        const dbResponse = await newCategory.save();
        return res.json({ message: `${category} with path:${path} saved successfully` });
    } catch (error) {
        console.log(error);
    }
}

const updateCategory = async (req, res) => {
    try {
        const { category, path, id } = req.body;
        if (!isvalidInputData({ category, path, id }))
            throw { code: 400, message: "Invalid input data" };

        const dbResponse = await Category.updateOne({_id: id}, { $set: { category, path } });
        if (dbResponse && dbResponse.modifiedCount !== 0)
            return res.status(201).json({ message: `Update successfull` });
        res.status(400).json({ message: "Same data entered" });

    } catch (error) {
        if (error.code === 11000)
            return res.status(400).json({ message: "Duplicate category and path" });
        if (error.code === 400)
            return res.status(400).json({message: error.message});
        res.status(500).json({ message: "Unknown error occurred" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const parsedUrl = url.parse(req.url);
        const queryParams = querystring.parse(parsedUrl.query);
        const id = queryParams['id'];
        if (!isvalidInputData({ id }))
            throw { code: 400, message: "Invalid input data" };
        const dbResponse = await Category.findByIdAndDelete(id);
        if (!dbResponse)
            return res.status(404).json({ 'message': 'Data not Found' });
        else
            return res.json({ 'message': `Deleted Successfully!` });
    } catch (error) {
        if(error.code === 400)
            return res.status(400).json({message: error.message});
        return res.status(500).json({ message: "Can't delete" });
    }
}

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };