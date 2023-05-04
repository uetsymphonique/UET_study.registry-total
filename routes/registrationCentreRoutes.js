const express = require('express');
const router = express.Router();
const RegistrationCentreController = require('../controllers/registrationCentreController');

router.route('/')
    .get(RegistrationCentreController.getAllCentres)
    .post(RegistrationCentreController.createCentre);
router.route('/:id')
    .get(RegistrationCentreController.getCentre)
    .patch(RegistrationCentreController.updateCentre)
    .delete(RegistrationCentreController.deleteCentre);




module.exports = router;