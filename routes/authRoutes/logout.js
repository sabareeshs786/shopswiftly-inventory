const express = require('express');
const router = express.Router();
const logoutController = require('../../controller/AuthControllers/logoutController');

router.get('/', logoutController.handleLogout);

module.exports = router;