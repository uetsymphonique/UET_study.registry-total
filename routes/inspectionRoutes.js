const express = require('express');
const AuthController = require('./../controllers/authController');
const InspectionController = require('./../controllers/inspectionController');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(AuthController.protect, InspectionController.getAllInspections)
    .post(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.createInspection);
router.route('/:id')
    .get(AuthController.protect, InspectionController.getInspection)
    // .patch(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.updateInspection)
    // .delete(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.deleteInspection);

module.exports = router;