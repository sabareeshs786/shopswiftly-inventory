const express = require('express');
const router = express.Router();
const itemController = require('../../controller/itemController');

router.route('/:category')
    .get(itemController.getItems)

router.route('/minmax/:category')
    .get(itemController.getMinMax);

router.route('/all-brands/:category')
    .get(itemController.getAllBrands);

router.route('/get-pagination-data/:category')
    .get(itemController.getMetaDataForPagination);

module.exports = router;