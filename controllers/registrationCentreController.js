const RegistrationCentre = require('../models/registrationCentreModel');

const Inspection = require('../models/inspectionModel');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');


const factory = require('./handleFactory');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const mongoose = require('mongoose');

exports.getAllCentres = factory.getAll(RegistrationCentre)
exports.createCentre = factory.createOne(RegistrationCentre)
exports.updateCentre = factory.updateOne(RegistrationCentre);
exports.deleteCentre = factory.deleteOne(RegistrationCentre);
exports.deactivateCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.findById(req.params.id);
    if (!centre) {
        return next(new AppError('No centre found with this id', 404));
    }
    const message = 'Your centre has been inactivated. Please contact your administrator for more information.';
    const emails = [centre.email];

    const users = await User.find({workFor: new mongoose.Types.ObjectId(req.params.id)});
    users.forEach(user => emails.push(user.email));
    try {
        await sendEmail({
            email: emails,
            subject: 'Your centre has been inactivated',
            text: message
        });
    } catch (err) {
        return next(new AppError('Email could not be sent', 500));
    }
    for (const user of users) {
        user.active = false;
        await user.save({
            validateBeforeSave: false
        });
    }
    centre.active = false;
    await centre.save({
        validateBeforeSave: false
    });

    res.status(204)
        .json({
            status: 'success',
            message: 'Emails have been sent to this centre and its employees. This centre and its accounts have been deactivated successfully!'
        });

})
exports.getCentre = factory.getOne(RegistrationCentre, {
    path: 'employees',
    select: '-password -passwordResetToken -passwordResetExpires'
}, {
    path: 'inspections',
});


exports.getCentre = catchAsync(async (req, res, next) => {
    let query = RegistrationCentre.findById(req.params.id)
        .populate({
            path: 'employees',
            select: '-password -passwordResetToken -passwordResetExpires'
        });

    const doc = await query;

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    doc.inspections = await Inspection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'madeBy',
                foreignField: '_id',
                as: 'user'
            }
        },
        {$unwind: '$user'},
        {$match: {'user.workFor': doc._id}},
        {
            $project: {
                __v: 0,
                user: 0
            }
        }
    ]);
    res.status(200)
        .json({
            status: 'success',
            data: {
                data: doc
            }
        });
})