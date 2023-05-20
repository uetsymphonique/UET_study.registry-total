const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const registrationCentreRouter = require('./../routes/registrationCentreRoutes');
const inspectionRouter = require('./../routes/inspectionRoutes');
const InspectionController = require('./../controllers/inspectionController');
const router = express.Router();
router.route('/inspections')
    .get(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.setAdditionalUserId, InspectionController.getAllInspections)
// router.route('/inspections/:id').get(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.setAdditionalParams, InspectionController.getInspection);
router.get('/registrationCentres/inspections',AuthController.protect, AuthController.restrictTo('staff'), InspectionController.setAdditionalCentreId, InspectionController.getAllInspections);
router.get('/:userId/inspections', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getAllInspections);

router.post('/signup', AuthController.signup);
router.post('/createAccount', AuthController.protect, AuthController.restrictTo('admin'), UserController.createAccount);
router.delete('/inactivateAccount/:id', AuthController.protect, AuthController.restrictTo('admin'), UserController.inactivateAccount);
router.post('/login', AuthController.login);

router.post('/checkResetToken', AuthController.checkResetToken);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);


router.patch('/updatePassword', AuthController.protect, AuthController.updatePassword);
router.patch('/updateMe', AuthController.protect, UserController.updateMe);
router.delete('/deleteMe', AuthController.protect, UserController.deleteMe);
router.get('/getMe', AuthController.protect, UserController.getMe);

router.route('/')
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserController.getAllUsers)
    // .post(AuthController.protect, AuthController.restrictTo('admin'), UserController.createUser);
router.route('/:id')
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserController.getUser)
    .patch(AuthController.protect, AuthController.restrictTo('admin'), UserController.updateUser)
    .delete(AuthController.protect, AuthController.restrictTo('admin'), UserController.deleteUser);

module.exports = router;