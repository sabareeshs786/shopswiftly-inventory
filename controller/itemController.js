const Mobile = require('../models/mobiles');

const getItems = async (req, res) => {
    const category = req.params.category;
    const preview = Boolean(req.query.preview);
    const brand = req.query.brand;

    if (category == "mobiles") {
        try {
            if (preview) {
                const items = await Mobile.find({brand: brand}).limit(5);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            } else {
                const items = await Mobile.find({brand: brand}).limit(20);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { getItems };