const express = require('express');
const UtilController = require('./../controllers/utilController');
const router = express.Router();
router.get('/provinces', UtilController.getAllProvinces);
router.get('/areas', UtilController.getAllAreas);
module.exports = router;