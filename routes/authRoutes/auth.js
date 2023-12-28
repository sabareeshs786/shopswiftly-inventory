const express = require('express');
const router = express.Router();
const authController = require('../../controller/AuthControllers/loginController');

router.post('/', authController.handleLogin);

module.exports = router;