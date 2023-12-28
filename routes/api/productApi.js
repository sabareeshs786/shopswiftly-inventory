const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../../controller/productController');

const uploader = async (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, '../images/');
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            },
        });
        const upload = multer({ storage: storage });

        await upload.single('image');
        next();
    }
    catch(error){
        console.log("Error in uploading image : ", error);
    }
}

router.route('/:category')
    .get(productController.getProduct)
    
router.post('/add-product', uploader, productController.addProduct)

module.exports = router;