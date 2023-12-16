const Mobile = require('../models/mobiles');

const getItems = async (req, res) => {
    const category = req.params.category || "mobiles";
    const preview = req.query.preview ? 
    String(req.query.preview).toLowerCase() == "true" 
    ? true : String(req.query.preview).toLowerCase() == "false" ?
    false : true
    : true;
    const brand = req.query.brand?.split(',') || "apple";
    const sort = req.query.sort || "price";
    const sortOrder = {}
    sortOrder[sort] = 1;
    console.log(preview);
    if (category == "mobiles") {
        try {
            if (preview) {
                const items = await Mobile.find({brand: {$in: brand }}).limit(5).sort(sortOrder);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            } else {
                const items = await Mobile.find({brand: {$in: brand }}).limit(20).sort(sortOrder);
                if (!items) return res.status(204).json({ 'message': `No items found for the category ${category}` });
                res.json(items);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { getItems };