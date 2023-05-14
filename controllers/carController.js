const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Car = require('./../models/carModel');
const Inspection = require('./../models/inspectionModel');
const factory = require('./handleFactory');
const APIFeatures = require('./../utils/apiFeatures');
const APIFeatures_aggregate = require('./../utils/apiFeatures_aggregate');
const filterObj = require('./../utils/filterObj');
const xlsxToJson = require('./../utils/xlsx');

exports.getAllCars = factory.getAll(Car)
exports.getCar = factory.getOne(Car, {path: 'inspections'});
// exports.getCars = catchAsync(async (req, res, next) => {
//     const car = await Car.findById(req.params.id);
//     console.log(await car.expiredInspectionDate());
// })
exports.createCar = factory.createOne(Car);
exports.deleteCar = factory.deleteOne(Car);
exports.updateCar = factory.deleteOne(Car);
exports.upload = catchAsync(async (req, res, next) => {
    if (!req.file.filename) {
        return next(new AppError('No file!', 400));
    } else {
        const data = await Car.create(xlsxToJson(req.file.path));
        res.status(201)
            .json({
                status: 'success',
                data
            })
    }
})

exports.expiredDateOfCar = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate()
        .group(groupByCar)
        .lookup(lookupByCar)
        .unwind('car')
        .project('_id expiredDate car.numberPlate car.registrationNumber'), req.query).paginate();
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                data
            },
        });
});
exports.monthPredictedStatsOfCar = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate()
        .group(groupByCar)
        .lookup(lookupByCar)
        .unwind('car')
        .project('_id expiredDate car.numberPlate car.registrationNumber')
        .match(getAnalyticsPerYear(req.params.year * 1))
        .addFields({
            month: {$month: '$expiredDate'}
        })
        .group({
            _id: '$month',
            prediction: {$sum: 1}
        })
        .addFields({
            month: '$_id'
        })
        .project('-_id'), req.query).sort()
        .paginate();
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                data
            },
        });
})

const groupByCar = {
    _id: '$car',
    expiredDate: {$max: '$expiredDate'}
};
const lookupByCar = {
    from: 'cars',
    localField: '_id',
    foreignField: '_id',
    as: 'car'
};
const getAnalyticsPerYear = (year) => ({
    expiredDate: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
    }
});