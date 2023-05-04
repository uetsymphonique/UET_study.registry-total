const AppError = require('./../utils/AppError');
const catchAsync = require('./../utils/catchAsync');
const Inspection = require('./../models/inspectionModel');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');
exports.getAllInspections = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Inspection.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const inspections = await features.query;

    // SEND RESPONSE
    res.status(200)
        .json({
            status: 'success',
            results: inspections.length,
            data: {inspections}
        });
});

exports.getInspection = catchAsync(async (req, res, next) => {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
        return next(new AppError('No inspection found with this id', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {inspection}
        })
});
exports.makeInspection = catchAsync(async (req, res, next) => {
    const inspection = await Inspection.create({
        car: req.params.car,
        madeBy: req.user._id,
    });
    res.status(201)
        .json({
            status: 'success',
            data: {inspection}
        });
})
exports.deleteInspection = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.updateInspection = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.createInspection = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};