const express = require('express');
const RegistrationCentreController = require('../controllers/registrationCentreController');
const AuthController = require('../controllers/authController');
const CarRouter = require('./carRoutes');
const InspectionRouter = require('./inspectionRoutes');

const router = express.Router();

/**
 * Middleware for login requirement and restrict to admin only
 */
router.use(AuthController.protect, AuthController.restrictTo('admin'));

/**
 * route: :id/registrationCentre/deactivateCentre
 * Deactivate a centre and all its employees
 */
router.delete('/deactivateCentre/:id', RegistrationCentreController.deactivateCentre);
/**
 * Routing to /inspections
 * Usage: /registrationCentre/:centreId/inspections/...
 * For: Get all inspections or inspection statistics of a particular centre
 */
router.use('/:centreId/inspections', InspectionRouter);
/**
 * Routing to /cars
 * Usage: /registrationCentre/:centerId/cars/...
 * For: Get predictions of cars inspected first time or re-inspected in a particular centre
 */
router.use('/:centreId/cars', CarRouter);

/**
 * Basic CRUD routes
 */
router.route('/')
    .get(RegistrationCentreController.getAllCentres)
    .post(RegistrationCentreController.createCentre);
router.route('/:id')
    .get(RegistrationCentreController.getCentre)
    .patch(RegistrationCentreController.updateCentre)
    // .delete(RegistrationCentreController.deleteCentre);


module.exports = router;