const express = require('express');
const router = express.Router();
const itemController = require('../../controller/itemController');

router.route('/:category')
    .get(itemController.getItem)

module.exports = router;