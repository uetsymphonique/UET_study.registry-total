const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Car = require('./../models/carModel');
const Inspection = require('./../models/inspectionModel');
const RegistrationCentre = require('./../models/registrationCentreModel');
const factory = require('./handleFactory');
const APIFeatures = require('./../utils/apiFeatures');
const APIFeatures_aggregate = require('./../utils/apiFeatures_aggregate');
const filterObj = require('./../utils/filterObj');
const xlsxToJson = require('./../utils/xlsx');
const mongoose = require('mongoose');
exports.setAdditionalParams = (req, res, next) => {
    if (!req.params.centreId) req.params.centreId = req.user.workFor;
    next();
};
exports.getAllCars = factory.getAll(Car)
exports.getCar = factory.getOne(Car, {path: 'inspections'});
exports.createCar = factory.createOne(Car);
exports.deleteCar = factory.deleteOne(Car);
exports.updateCar = factory.updateOne(Car);
exports.inspectCar = catchAsync(async (req, res, next) => {
    const filteredBody = filterObj(req.body, 'type', 'brand', 'modelCode', 'engineNumber', 'chassisNumber', 'color', 'manufacturedYear', 'manufacturedCountry', 'boughtPlace', 'purpose', 'specification', 'recovered');
    const inspectedCar = await Car.findByIdAndUpdate(req.params.id, filteredBody, {
        new: true,
        runValidators: true
    });
    if (!inspectedCar) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200)
        .json({
            status: 'success',
            message: 'Inspect car successfully!',
            data: {
                data: inspectedCar
            }
        })
});
exports.upload = catchAsync(async (req, res, next) => {
    if (!req.file.filename) {
        return next(new AppError('No file!', 400));
    } else {
        const data = await Car.create(xlsxToJson(req.file.path));
        res.status(201)
            .json({
                status: 'success',
                // data
            })
    }
});
exports.currentMonthExpiredPredictionsOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_groupCars,
        ...pipeline_lookupCentre,
        ...pipeline_matchCurrentMonth(),
    ]), req.query).prefilter(prefilterFields)
        .push({
                $addFields: {
                    status: {$cond: [{$gte: ['$expiredDate', new Date()]}, 'about-to-expire', 'expired']}
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: {$sum: 1}
                }
            },
            {$addFields: {status: '$_id'}},
            {$project: {_id: 0}})
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const reInspections = await features.query;
    res.status(200)
        .json({
            status: 'success',
            reInspections
        });

});
exports.currentMonthExpiredPredictionsOfCentre = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_groupCars,
        ...pipeline_matchCentreById(req.params.centreId),
        ...pipeline_matchCurrentMonth()
    ]), req.query).prefilter(prefilterFields)
        .push({
                $addFields: {
                    status: {$cond: [{$gte: ['$expiredDate', new Date()]}, 'about-to-expire', 'expired']}
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: {$sum: 1}
                }
            },
            {$addFields: {status: '$_id'}},
            {$project: {_id: 0}})
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const reInspections = await features.query;
    res.status(200)
        .json({
            status: 'success',
            reInspections
        });
});
exports.currentMonthNotInspectedPredictionsOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Car.find({inspected:false}), req.query).filter().sort().limitFields();
    const notInspectedCars = await features.query;
    res.status(200)
        .json({
            status: 'success',
            results: notInspectedCars.length,
            data: {
                data: notInspectedCars
            }
        });
});
exports.currentMonthNotInspectedPredictionsOfCentre = catchAsync(async (req, res, next) => {
    const centre = await RegistrationCentre.findById(req.params.centreId);
    const cnt = await RegistrationCentre.countDocuments({address: centre.address});
    const notInspectedCars = await Car.find({inspected: false, predictedAddress: centre.address});
    res.status(200)
        .json({
            status: 'success',
            data: {
                data: notInspectedCars.length/cnt
            }
        });
});

const pipeline_lookupCentre = [
    {
        $lookup: {
            from: 'registrationcentres',
            localField: 'centre',
            foreignField: '_id',
            as: 'registrationCentre'
        }
    }, {$unwind: '$registrationCentre'},
    {
        $addFields: {
            centreName: '$registrationCentre.name',
            centreSide: '$registrationCentre.side',
            centreArea: '$registrationCentre.area',
            centreAddress: '$registrationCentre.address'
        }
    }, {
        $project: {
            registrationCentre: 0
        }
    }
];
const pipeline_matchCentreById = (id) => [
    {$match: {'centre': new mongoose.Types.ObjectId(id)}},
];
const pipeline_matchCurrentMonth = () => {
    const date = new Date();
    return [
        {
            $match: {
                expiredDate: {
                    $lte: new Date(`${date.getFullYear()}-${date.getMonth() + 1}-31`)
                }
            }
        }
    ]
}
const pipeline_getMonthExpirations = [
    {
        $group: {
            _id: {$month: '$expiredDate'},
            prediction: {$sum: 1}
        }
    },
    {$addFields: {month: '$_id'}},
    {$project: {_id: 0}},
];
const pipeline_groupCars = [
    {
        $group: {
            _id: '$car',
            expiredDate: {$max: '$expiredDate'},
            centre: {$max: '$centre'}
        }
    },
    {$addFields: {car: '$_id'}},
    {$project: {_id: 0}},
];
const prefilterFields = ['centreName', 'centreSide', 'centreArea', 'centreAddress', 'inspectionYear', 'inspectionSeason', 'inspectionMonth'];
