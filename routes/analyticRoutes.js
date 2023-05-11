const express = require('express');
const AuthController = require('./../controllers/authController');
const InspectionController = require('./../controllers/inspectionController');

const router = express.Router();

// for each centre:
router.get('/inspections/monthly-inspected/:year', AuthController.protect, InspectionController.getMonthAnalyticsPerYearByOwnId);
router.get('/inspections/seasonly-inspected/:year', AuthController.protect, InspectionController.getSeasonAnalyticsPerYearByOwnId);
router.get('/inspections/yearly-inspected', AuthController.protect, InspectionController.getYearAnalyticsByOwnId);
router.get('/inspections/monthly-expired/:year', AuthController.protect, InspectionController.getMonthlyExpiredAnalyticsPerYearByOwnId);
router.get('/inspections/monthly-predicted/:year', AuthController.protect, InspectionController.getMonthlyPredictedAnalyticsPerYearByOwnId);

//for registrytotal
router.get('/inspections/general-analytics/monthly-inspected/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyInspectionsOfCentres);
router.get('/inspections/general-analytics/seasonly-inspected/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getSeasonlyInspectionsOfCentres);
router.get('/inspections/general-analytics/yearly-inspected', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getYearlyInspectionsOfCentres);
router.get('/inspections/general-analytics/monthly-expired/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyExpiredInspectationsOfCentres);
router.get('/inspections/general-analytics/monthly-predicted/:year', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getMonthlyPredictedInspectationsOfCentres);

// router.get('/cars/')


module.exports = router;