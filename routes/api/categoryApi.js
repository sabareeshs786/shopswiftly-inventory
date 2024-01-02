const express = require('express');
const router = express.Router();
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');
const categoryController = require('../../controller/categoryController');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), categoryController.getCategories)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), categoryController.addCategory)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), categoryController.updateCategory)
    .delete(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), categoryController.deleteCategory)

module.exports = router;