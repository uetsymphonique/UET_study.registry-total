const RegistrationCentre = require('../models/registrationCentreModel');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(RegistrationCentre.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const centres = await features.query;
    res.status(200)
        .json({
            status: 'success',
            count: centres.length,
            data: {centres}
        });
});

exports.createCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.create(req.body);
    res.status(201)
        .json({
            status: 'success',
            data: {centre}
        });
});

exports.updateCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!centre) {
        return next(new AppError('No centre found with this id', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {centre}
        });
});

exports.deleteCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.findByIdAndDelete(req.params.id);
    if (!centre) {
        return next(new AppError('No centre found with this id', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {}
        });
});

exports.getCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.findById(req.params.id);
    if (!centre) {
        return next(new AppError('No centre found with this id', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {centre}
        })
})
exports.getAnalysisOfInspections = catchAsync(async (req, res, next) => {
    //const
})