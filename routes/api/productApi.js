const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../../controller/productController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.route('/:category')
    .get(productController.getProduct)
    .post('/add-product', upload.single('image'), productController.addProduct)

module.exports = router;