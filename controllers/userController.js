const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handleFactory')
const filterObj = require('./../utils/filterObj');
const sendEmail = require('../utils/email');
const crypto = require('crypto');


exports.getAllUsers = factory.getAll(User);

exports.getMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update', 400));
    }
    // 2) Get user document
    const user = await User.findById(req.user.id)
        .select('-password -passwordResetToken -passwordResetExpires')
        .populate('workFor', '-__v -slug -side -area').populate({
            path: 'inspections'
        });
    res.status(200)
        .json({
            status: 'success',
            data: {
                user
            }
        });
});
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update', 400));
    }
    // 2) Update user document
    const filteredBody = filterObj(req.body,'email', 'phone', 'name', 'dateOfBirth');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200)
        .json({
            status: 'success',
            message: 'User updated successfully',
            data: {
                user: updatedUser
            }
        });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});
    res.status(204)
        .json({
            status: 'success',
            message: 'User inactive successfully',
            data: null
        });
});
exports.createAccount = catchAsync(async (req, res, next) => {
    const randomPassword = crypto.randomBytes(8)
        .toString('hex');
    req.body.password = randomPassword;
    req.body.passwordConfirm = randomPassword;
    const message = `Your account has been created. Please login your account with your email address and password: ${req.body.password}`;
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your account has been created',
            text: message
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Email could not be sent', 500));
    }
    const newUser = await User.create(req.body);
    res.status(200)
        .json({
            status: 'success',
            message: 'An email has been sent to the user. Account has been created successfully!',
            data: {
                data: newUser
            }
        });
});

exports.deactivateAccount = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('Không có bản ghi nào được tìm thấy', 404));
    }
    const message = `Your account has been deactivated. Please contact your administrator for more information`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your account has been deactivated',
            text: message
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Email could not be sent', 500));
    }
    user.active = false;
    await user.save({
        validateBeforeSave: false
    });
    res.status(204)
        .json({
            status: 'success',
            message: 'An email has been sent to the user. Account has been deactivated successfully!'
        });
});


exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User, {
    path: 'workFor',
    select: 'name address'
},{
    path: 'inspections'
});
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);