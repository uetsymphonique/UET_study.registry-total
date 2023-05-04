const express = require('express');
const router = express.Router();
const AuthController = require('./../controllers/authController');
const InspectionController = require('./../controllers/inspectionController')

router.route('/')
    .get(AuthController.protect, InspectionController.getAllInspections)
    .post(AuthController.protect, InspectionController.createInspection);
router.route('/:id')
    .get(AuthController.protect, InspectionController.getInspection)
    .patch(AuthController.protect, InspectionController.updateInspection)
    .delete(AuthController.protect, InspectionController.deleteInspection);
router.post('/makeInspection/:car', AuthController.protect, InspectionController.makeInspection);

module.exports = router;