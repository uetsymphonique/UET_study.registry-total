const express = require('express');
const router = express.Router({mergeParams: true});
const AuthController = require('./../controllers/authController');
const CarController = require('./../controllers/carController');
const InspectionRouter = require('./inspectionRoutes');
const multer = require('multer');
const upload = multer({dest: 'uploads/xlsx/'});

// All routes require logging in
router.use(AuthController.protect);

/**
 * routes /cars/:carId/inspections
 * Redirect to InspectionRouter
 */
router.use('/:carId/inspections', InspectionRouter);

/**
 * routes /cars/uploads
 * Upload file xlsx to server and save it to the database
 */
router.post('/uploads', AuthController.restrictTo('admin'), upload.single('file'), CarController.upload);

/**
 * routes cars/allCentresStatistics/expirationPredictions
 * Predict the number of inspections which have to be termed in current month (including: 'expired', 'about-to-expire') of all centres
 * query params: centreAddress, centreSide, centreArea
 *
 * routes cars/allCentresStatistics/expirationPredictions
 * Predict the number of cars which will have first-time inspection in current month
 * query params: predictedAddress, predictedSide, predictedArea
 */
router.get('/allCentresStatistics/expirationPredictions', AuthController.restrictTo('admin'), CarController.currentMonthExpiredPredictionsOfAllCentres);
router.get('/allCentresStatistics/newInspectionPredictions', AuthController.restrictTo('admin'), CarController.currentMonthNotInspectedPredictionsOfAllCentres);

/**
 * routes cars/allCentresStatistics/expirationPredictions
 * Predict the number of inspections which have to be termed in current month (including: 'expired', 'about-to-expire')
 * of a centre (defined in :centreId by merging parameters or req.user.workFor)
 *
 * routes cars/allCentresStatistics/expirationPredictions
 * Predict the number of cars which will have first-time inspection in current month
 * of a centre (defined in :centreId by merging parameters or req.user.workFor)
 */
router.get('/centreStatistics/expirationPredictions', CarController.setAdditionalParams, CarController.currentMonthExpiredPredictionsOfCentre);
router.get('/centreStatistics/newInspectionPredictions', CarController.setAdditionalParams, CarController.currentMonthNotInspectedPredictionsOfCentre);

/**
 * routes cars/:id/inspects
 * Inspect a car (defined in :id) fill the information and specification of car
 */
router.patch('/:id/inspects', AuthController.restrictTo('staff'), CarController.inspectCar);

router.get('/numberOfDocuments', CarController.getNumberOfCars);

/**
 * Basic CRUD routes
 * Get all cars
 * Create car
 * Get car, delete car, update car by id
 */
router.route('/')
    .get(CarController.getAllCars)
    // .post(AuthController.restrictTo('admin'), CarController.createCar);
router.route('/:id')
    .get(CarController.getCar)
    // .patch(AuthController.restrictTo('admin'), CarController.updateCar)
    // .delete(AuthController.restrictTo('admin'), CarController.deleteCar);

module.exports = router;
