const express = require('express');
const router = express.Router();
const productController = require('../../controller/productController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/:category')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), productController.getProduct)

module.exports = router;