const express = require('express');
const router = express.Router();
const AuthController = require('./../controllers/authController');
const CarController = require('./../controllers/carController');

router.route('/')
    .get(AuthController.protect, CarController.getAllCars)
    .post(AuthController.protect, CarController.createCar);
router.route('/:id')
    .get(AuthController.protect, CarController.getCar)
    .patch(AuthController.protect, CarController.updateCar)
    .delete(AuthController.protect, CarController.deleteCar);

router.post('/inspectCar/:id', CarController.inspectCar);

module.exports = router;
