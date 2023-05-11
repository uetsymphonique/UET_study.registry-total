const AppError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {promisify} = require('util')
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode)
        .json({
            status: 'success',
            token,
            data: {
                user
            }
        });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);

});

exports.login = catchAsync(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    //check exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    //check legit
    const user = await User.findOne({email})
        .select('+password').populate('workFor', '-__v -slug -side -area');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //if everything ok
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // getting token and checking
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get acesss.', 401));
    }

    // verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('User belonging to this token does no longer exist.', 401));
    }

    // check if user changed password after token was issued
    if (currentUser.changesPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    req.user = currentUser
    next();
});

exports.restrictTo = (...roles) => { // roles is an array
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email address
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new AppError('There is no user with that email', 404));
    } else {
        //console.log(user);
    }

    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});

    // 3) Send email with reset token
    // const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const resetUrl = `${resetToken}`;
    console.log(resetUrl);
    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        This is the reset-password code to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token (only valid for 10 minutes)',
            text: message
        });

        res.status(200)
            .json({
                status: 'success',
                message: 'An email has been sent with instructions to reset your password'
            });
    } catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('Email could not be sent', 500));
    }

});

exports.checkResetToken = catchAsync(async (req,res, next) => {
    const hashedToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });


    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Password reset token is invalid or has expired', 400));
    }
    res.status(200)
        .json({
            status: 'success',
            message: 'This token is valid!!!'
        });
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on token
    const hashedToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    });


    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Password reset token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get the user from collection
    const user = await User.findById(req.user.id)
        .select('+password');

    // 2) Check if POSTed current password is correct
    if (!user.correctPassword(req.body.passwordCurrent, req.body.password)) {
        return next(new AppError('Your current password is wrong!', 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});


