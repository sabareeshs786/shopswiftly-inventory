const express = require('express');
const router = express.Router();
const brandController = require('../../controller/brandController');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), brandController.getBrands)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), brandController.addBrand)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), brandController.updateBrand)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), brandController.deleteBrand)

module.exports = router;