const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(User.find({role: { $ne: 'admin'}}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const users = await features.query;

    // SEND RESPONSE
    res.status(200)
        .json({
            status: 'success',
            results: users.length,
            data: {users}
        });
});
exports.getMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update', 400));
    }
    // 2) Get user document
    const user = await User.findById(req.user.id).select('-password');
    res.status(200)
       .json({
            status:'success',
            data: {
                user
            }
        });
})
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password update', 400));
    }
    // 2) Update user document
    const filteredBody = filterObj(req.body, 'name', 'email');
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
            message: 'User deleted successfully',
            data: null
        });
});
exports.createUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.getUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.deleteUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.updateUser = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};