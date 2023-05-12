const express = require('express');
const AuthController = require('./../controllers/authController');
const InspectionController = require('./../controllers/inspectionController');
const {restrictTo} = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(AuthController.protect);

router.route('/')
    .get(InspectionController.getAllInspections)
    .post(AuthController.restrictTo('staff'), InspectionController.createInspection);
router.route('/:id')
    .get(InspectionController.getInspection)
    // .patch(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.updateInspection)
    // .delete(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.deleteInspection);
router.get('/centreStatistics/month/:year', InspectionController.monthStatsInYearOfCentre);
router.get('/centreStatistics/season/:year', InspectionController.seasonStatsInYearOfCentre);
router.get('/centreStatistics/year',InspectionController.yearStatsOfCentre);

router.get('/allCentresStatistics/month/:year', AuthController.restrictTo('admin'), InspectionController.monthStatsInYearOfAllCentres);
router.get('/allCentresStatistics/season/:year', AuthController.restrictTo('admin'), InspectionController.seasonStatsInYearOfAllCentres);
router.get('/allCentresStatistics/year', AuthController.restrictTo('admin'), InspectionController.yearStatsOfAllCentres);
router.get('/allCentresStatistics/centre', AuthController.restrictTo('admin'), InspectionController.centreStatsOfAllCentres);
module.exports = router;