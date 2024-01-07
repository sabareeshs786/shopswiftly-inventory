const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brandController');
const productController = require('../../controller/productController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productController.getProducts)

router.route('/minmax/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productController.getMinMax);

router.route('/all-brands/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), brandController.getBrandsByCategory);

router.route('/get-pagination-data/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productController.getMetaDataForPagination);

module.exports = router;