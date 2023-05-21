const express = require('express');
const AuthController = require('./../controllers/authController');
const InspectionController = require('./../controllers/inspectionController');

const router = express.Router({mergeParams: true});
/**
 * Require login with all routes
 */
router.use(AuthController.protect);

/**
 * Basic CRUD routes
 * Get all inspections
 * Create inspection
 * Get inspection, delete inspection (not use), update inspection (not use) by id
 */
router.route('/')
    .get(InspectionController.getAllInspections)
    .post(AuthController.restrictTo('staff'), InspectionController.createInspection);
router.route('/:id')
    .get(InspectionController.getInspection)
// .patch(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.updateInspection)
// .delete(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.deleteInspection);

/**
 * route /inspections/centreStatistics/month/:year
 * Usage: /inspections/centreStatistics/month/:year (staff)
 *        /registrationCentres/:centreId/inspections/centreStatistics/month/:year (admin)
 * Number of inspections made by your centre (with staff) or a centre (with admin) in each month of a particular year
 */
router.get('/centreStatistics/month/:year', InspectionController.setAdditionalCentreId, InspectionController.monthStatsInYearOfCentre);
 /**
  * route /inspections/centreStatistics/season/:year
  * Usage: /inspections/centreStatistics/season/:year (staff)
  *        /registrationCentres/:centreId/inspections/centreStatistics/season/:year (admin)
  * Number of inspections made by your centre (with staff) or a centre (with admin) in each season of a particular year
 */
router.get('/centreStatistics/season/:year', InspectionController.setAdditionalCentreId, InspectionController.seasonStatsInYearOfCentre);
/**
 * route /inspections/centreStatistics/year
 * Usage: /inspections/centreStatistics/year (staff)
 *        /registrationCentres/:centreId/inspections/centreStatistics/year (admin)
 * Number of inspections made by your centre (with staff) or a centre (with admin) in each year
 */
router.get('/centreStatistics/year', InspectionController.setAdditionalCentreId, InspectionController.yearStatsOfCentre);

/**
 * route /inspections/centreStatistics/monthExpired/:year
 * Usage: /inspections/centreStatistics/monthExpired/:year (staff)
 *        /registrationCentres/:centreId/inspections/centreStatistics/monthExpired/:year (admin)
 * Number of inspections made by your centre (with staff) or a centre (with admin) expired in each month of a particular year
 */
router.get('/centreStatistics/monthExpired/:year', InspectionController.setAdditionalCentreId, InspectionController.monthExpiredStatsInYearOfCentre);

/**
 * Statistics about the number of inspections in all centres
 * Filter: centreAddress (province), centreSide (side), centreArea (area)
 */
router.get('/allCentresStatistics/month/:year', AuthController.restrictTo('admin'), InspectionController.monthStatsInYearOfAllCentres);
router.get('/allCentresStatistics/season/:year', AuthController.restrictTo('admin'), InspectionController.seasonStatsInYearOfAllCentres);
router.get('/allCentresStatistics/year', AuthController.restrictTo('admin'), InspectionController.yearStatsOfAllCentres);
router.get('/allCentresStatistics/centre', AuthController.restrictTo('admin'), InspectionController.centreStatsOfAllCentres);
router.get('/allCentresStatistics/monthExpired/:year', AuthController.restrictTo('admin'), InspectionController.monthExpiredStatsInYearOfAllCentres);

module.exports = router;