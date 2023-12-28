const express = require('express');
const router = express.Router();
const registerController = require('../../controller/AuthControllers/signupController');

router.post('/', registerController.handleNewUser);

module.exports = router;