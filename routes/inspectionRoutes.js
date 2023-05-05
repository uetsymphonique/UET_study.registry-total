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

// for each centre:
router.get('/analytics/monthly-inspected/:year', AuthController.protect, InspectionController.getMonthlyInspectionsOfCentre);
router.get('/analytics/seasonly-inspected/:year', AuthController.protect, InspectionController.getSeasonlyInspectionsOfCentre);
router.get('/analytics/yearly-inspected', AuthController.protect, InspectionController.getYearlyInspectionsOfCentre);
router.get('/analytics/monthly-expired/:year', AuthController.protect, InspectionController.getMonthlyExpiredInspectationsOfCentre);
router.get('/analytics/monthly-predicted/:year', AuthController.protect, InspectionController.getMonthlyPredictedInspectationsOfCentre);

//for registrytotal
router.get('/monthly-inspected/:year/registrationCentres', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyInspectionsOfCentres);
router.get('/seasonly-inspected/:year/registrationCentres', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getSeasonlyInspectionsOfCentres);
router.get('/yearly-inspected/registrationCentres', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getYearlyInspectionsOfCentres);
router.get('/monthly-expired/:year/registrationCentres', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyExpiredInspectationsOfCentres);
router.get('/monthly-predicted/:year/registrationCentres', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyPredictedInspectationsOfCentres);
module.exports = router;