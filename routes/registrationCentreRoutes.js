const express = require('express');
const RegistrationCentreController = require('../controllers/registrationCentreController');
const AuthController = require('../controllers/authController');
const CarRouter = require('./carRoutes');
const InspectionRouter = require('./inspectionRoutes');

const router = express.Router();

router.use(AuthController.protect, AuthController.restrictTo('admin'));
router.use('/:centreId/inspections', InspectionRouter);
router.use('/:centreId/cars', CarRouter);
router.route('/')
    .get(RegistrationCentreController.getAllCentres)
    .post(RegistrationCentreController.createCentre);
router.route('/:id')
    .get(RegistrationCentreController.getCentre)
    .patch(RegistrationCentreController.updateCentre)
    .delete(RegistrationCentreController.deleteCentre);


module.exports = router;