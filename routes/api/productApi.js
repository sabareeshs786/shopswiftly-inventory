const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');

router.route('/:category')
    .get(productController.getProduct)

module.exports = router;