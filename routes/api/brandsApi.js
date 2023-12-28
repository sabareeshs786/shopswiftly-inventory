const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brandController');

router.route('/')
    .get(brandController.getBrands)
    .post(brandController.addBrand)
    .put(brandController.updateBrand)
    .delete(brandController.deleteBrand)

module.exports = router;