const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store');

router.get('/', storeController.homePage);

module.exports = router;
