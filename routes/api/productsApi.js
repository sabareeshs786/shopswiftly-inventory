const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brandController');
const productController = require('../../controller/productController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/:category')
    .get(productController.getProducts)

router.route('/minmax/:category')
    .get(productController.getMinMax);

router.route('/all-brands/:category')
    .get(brandController.getBrandsByCategory);

router.route('/get-pagination-data/:category')
    .get(productController.getMetaDataForPagination);

module.exports = router;