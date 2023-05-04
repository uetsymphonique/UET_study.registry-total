const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Car = require('./../models/carModel');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');


exports.getAllCars = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Car.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const cars = await features.query;

    // SEND RESPONSE
    res.status(200)
        .json({
            status: 'success',
            results: cars.length,
            data: {cars}
        });
});

exports.getCar = catchAsync(async (req, res, next) => {
    const car = await Car.findById(req.params.id);
    if (!car) {
        return next(new AppError('No car found with this id', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            data: {car}
        });
});
exports.inspectCar = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'specification', 'recovered');
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    });
    res.status(201)
        .json({
            status: 'success',
            message: 'Car inspected successfully',
            data: {car: updatedCar}
        });
});

exports.createCar = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.deleteCar = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};
exports.updateCar = (req, res) => {
    res.status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined',
        });
};