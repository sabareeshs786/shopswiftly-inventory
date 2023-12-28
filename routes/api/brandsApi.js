const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brandController');

router.route('/')
    .get(brandController.getBrands)

module.exports = router;