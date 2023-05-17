const express = require('express');
const router = express.Router({mergeParams: true});
const AuthController = require('./../controllers/authController');
const CarController = require('./../controllers/carController');
const InspectionRouter = require('./inspectionRoutes');
const multer = require('multer');
const upload = multer({ dest: 'uploads/xlsx/'});

router.use(AuthController.protect);

router.use('/:carId/inspections', InspectionRouter);
router.post('/uploads', AuthController.restrictTo('admin'), upload.single('file'), CarController.upload);
router.get('/predictions', CarController.currentMonthPredictionsOfAllCentres)
router.route('/')
    .get(CarController.getAllCars)
    .post(AuthController.restrictTo('admin'), CarController.createCar);
router.route('/:id')
    .get(CarController.getCar)
    .patch(AuthController.restrictTo('admin'), CarController.updateCar)
    .delete(AuthController.restrictTo('admin'), CarController.deleteCar);

module.exports = router;
