const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', AuthController.signup);
router.post('/createAccount',AuthController.protect, AuthController.restrictTo('admin'), AuthController.createAccount);
router.post('/login', AuthController.login);

router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);


router.patch('/updatePassword', AuthController.protect, AuthController.updatePassword);
router.patch('/updateMe', AuthController.protect, UserController.updateMe);
router.delete('/deleteMe', AuthController.protect, UserController.deleteMe);
router.get('/getMe', AuthController.protect, UserController.getMe);

router.route('/')
    .get(AuthController.protect, AuthController.restrictTo('admin'), UserController.getAllUsers)
    .post(AuthController.protect, AuthController.restrictTo('admin'),UserController.createUser);
router.route('/:id')
    .get(AuthController.protect, AuthController.restrictTo('admin'),UserController.getUser)
    .patch(AuthController.protect, AuthController.restrictTo('admin'),UserController.updateUser)
    .delete(AuthController.protect, AuthController.restrictTo('admin'),UserController.deleteUser);

module.exports = router;