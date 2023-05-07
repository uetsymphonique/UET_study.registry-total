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
router.get('/analytics/monthly-inspected/:year', AuthController.protect, InspectionController.getMonthAnalyticsPerYearByOwnId);
router.get('/analytics/seasonly-inspected/:year', AuthController.protect, InspectionController.getSeasonAnalyticsPerYearByOwnId);
router.get('/analytics/yearly-inspected', AuthController.protect, InspectionController.getYearAnalyticsByOwnId);
router.get('/analytics/monthly-expired/:year', AuthController.protect, InspectionController.getMonthlyExpiredAnalyticsPerYearByOwnId);
router.get('/analytics/monthly-predicted/:year', AuthController.protect, InspectionController.getMonthlyPredictedAnalyticsPerYearByOwnId);

//for registrytotal
router.get('/general-analytics/monthly-inspected/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyInspectionsOfCentres);
router.get('/general-analytics/seasonly-inspected/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getSeasonlyInspectionsOfCentres);
router.get('/general-analytics/yearly-inspected', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getYearlyInspectionsOfCentres);
router.get('/general-analytics/monthly-expired/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyExpiredInspectationsOfCentres);
router.get('/general-analytics/monthly-predicted/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyPredictedInspectationsOfCentres);
module.exports = router;