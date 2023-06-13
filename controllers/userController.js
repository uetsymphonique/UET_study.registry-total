const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handleFactory')
const filterObj = require('./../utils/filterObj');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const validator = require('validator')


exports.getAllUsers = factory.getAll(User);
exports.getNumberOfUsers = factory.getNumberOfDocuments(User);

exports.getMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Tính năng này không dùng để thay đổi mật khẩu', 400));
    }
    // 2) Get user document
    const user = await User.findById(req.user.id)
        .select('-password -passwordResetToken -passwordResetExpires')
        .populate('workFor', '-__v -slug -side -area')
        .populate({
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
    const filteredBody = filterObj(req.body, 'phone', 'name', 'dateOfBirth');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    res.status(200)
        .json({
            status: 'success',
            message: 'Thông tin người dùng được cập nhật thành công',
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
            message: 'Tài khoản của bạn đã bị vô hiệu hoá',
            data: null
        });
});
exports.createAccount = catchAsync(async (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return next(new AppError('Email không hợp lệ!', 400));
    }
    const randomPassword = crypto.randomBytes(8)
        .toString('hex');
    req.body.password = randomPassword;
    req.body.passwordConfirm = randomPassword;
    const message = `Tài khoản của bạn đã được tạo. Vui lòng đăng nhập với email và mật khẩu: ${req.body.password}`;
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Tài khoản của bạn đã được tạo',
            text: message
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Email không thể gửi', 500));
    }
    const newUser = await User.create(req.body);
    res.status(200)
        .json({
            status: 'success',
            message: 'Đã gửi thông báo qua email tới người dùng. Tài khoản được tạo thành công!',
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
    const message = `Tài khoản của bạn đã bị vô hiệu hoá. Vui lòng liên hệ quản trị viên để biết thêm thông tin`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Tài khoản của bạn đã bị vô hiệu hoá',
            text: message
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Email không thể gửi', 500));
    }
    user.active = false;
    await user.save({
        validateBeforeSave: false
    });
    res.status(204)
        .json({
            status: 'success',
            message: 'Đã gửi thông báo qua email tới người dùng. Tài khoản này đã bị vô hiệu hoá!'
        });
});


exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User, {
    path: 'workFor',
    select: 'name address'
}, {
    path: 'inspections'
});
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);