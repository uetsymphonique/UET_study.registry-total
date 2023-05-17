const RegistrationCentre = require('../models/registrationCentreModel');

const Inspection = require('../models/inspectionModel');
const catchAsync = require('./../utils/catchAsync');

const factory = require('./handleFactory');
const AppError = require('../utils/appError');

exports.getAllCentres = factory.getAll(RegistrationCentre)
exports.createCentre = factory.createOne(RegistrationCentre)
exports.updateCentre = factory.updateOne(RegistrationCentre);
exports.deleteCentre = factory.deleteOne(RegistrationCentre);
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