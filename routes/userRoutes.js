const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const InspectionController = require('./../controllers/inspectionController');
const router = express.Router();

/**
 * route users/inspections (staff only)
 * Get all inspections made by myself
 */
router.route('/inspections')
    .get(AuthController.protect, AuthController.restrictTo('staff'), InspectionController.setAdditionalUserId, InspectionController.getAllInspections)

/**
 * route users/registrationCentres/inspections (staff only)
 * Get all inspections made by my centre
 */
router.get('/registrationCentres/inspections',AuthController.protect, AuthController.restrictTo('staff'), InspectionController.setAdditionalCentreId, InspectionController.getAllInspections);
/**
 * route /users/:userId/inspections (admin only)
 * Get all inspections made by a particular staff
 */
router.get('/:userId/inspections', AuthController.protect, AuthController.restrictTo('admin'), InspectionController.getAllInspections);


// router.post('/signup', AuthController.signup);
/**
 * route /users/createAccount (admin only)
 * Create a staff user and create corresponding account
 */
router.post('/createAccount', AuthController.protect, AuthController.restrictTo('admin'), UserController.createAccount);
/**
 * route /users/deactivateAccount/:id (admin only)
 * Deactivate an account (active: false and not delete doccument in database)
 */
router.delete('/deactivateAccount/:id', AuthController.protect, AuthController.restrictTo('admin'), UserController.deactivateAccount);
/**
 * route /users/login
 * Login
 */
router.post('/login', AuthController.login);

/**
 * route /users/checkResetToken
 * Check your reset-password token
 */
router.post('/checkResetToken', AuthController.checkResetToken);

/**
 * route /users/forgotPassword
 * Request your forget with email to reset your password
 */
router.post('/forgotPassword', AuthController.forgotPassword);

/**
 * route /users/resetPassword
 * Reset your password
 */
router.patch('/resetPassword/:token', AuthController.resetPassword);

/**
 * route /users/updatePassword
 * Update your password
 */
router.patch('/updatePassword', AuthController.protect, AuthController.updatePassword);

/**
 * route /users/updateMe
 * Update your profile
 */
router.patch('/updateMe', AuthController.protect, UserController.updateMe);

/**
 * route /users/deleteMe
 * Delete (deactivate) your account
 */
router.delete('/deleteMe', AuthController.protect, UserController.deleteMe);

/**
 * route /users/getMe
 * Get your profiles
 */
router.get('/getMe', AuthController.protect, UserController.getMe);

/**
 * Basic CRUD routes
 */
router.route('/')
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserController.getAllUsers)
    // .post(AuthController.protect, AuthController.restrictTo('admin'), UserController.createUser);
router.route('/:id')
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserController.getUser)
    // .patch(AuthController.protect, AuthController.restrictTo('admin'), UserController.updateUser)
    // .delete(AuthController.protect, AuthController.restrictTo('admin'), UserController.deleteUser);

module.exports = router;