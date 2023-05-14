const express = require('express');
const router = express.Router({mergeParams: true});
const AuthController = require('./../controllers/authController');
const CarController = require('./../controllers/carController');
const InspectionRouter = require('./inspectionRoutes');
const multer = require('multer');
const upload = multer({ dest: 'uploads/xlsx/'});
router.use(AuthController.protect);

router.get('/inspectionsExpired', CarController.expiredDateOfCar);
router.get('/allCentresStatistics/monthPredicted/:year', CarController.monthPredictedStatsOfCar);
router.use('/:carId/inspections', InspectionRouter);
router.post('/uploads', upload.single('file'), CarController.upload)
router.route('/')
    .get(CarController.getAllCars)
    .post(AuthController.restrictTo('admin'), CarController.createCar);
router.route('/:id')
    .get(CarController.getCar)
    .patch(AuthController.restrictTo('admin'), CarController.updateCar)
    .delete(AuthController.restrictTo('admin'), CarController.deleteCar);

module.exports = router;
