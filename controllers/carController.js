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
                // data
            })
    }
});
exports.currentMonthPredictionsOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_groupCars,
        ...pipeline_lookupCentre,
        ...pipeline_matchCurrentMonth(),
        {
            $addFields: {
                status: { $cond: [ { $gte: ['$expiredDate', new Date('2023-06-15')]}, 'about-to-expire', 'expired' ] }
            }
        },
        {
            $group: {
                _id: '$status',
                count: {$sum: 1}
            }
        },
        {$addFields: {status: '$_id'}},
        {$project: {_id: 0}}
    ]), req.query)
        .filter([])
        .sort()
        .limitFields()
        .paginate();
    // console.log(JSON.stringify(features.query.pipeline()));
    const reInspections = await features.query;
    const notInspectedCars = await Car.find({inspected: {$ne: true}});
    res.status(200)
        .json({
            status: 'success',
            reInspections,
            notInspectedCars: notInspectedCars.length
        });

})
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
const pipeline_matchCurrentMonth = () => {
    const date = new Date('2023-06-15');
    return [
        {
            $match: {
                expiredDate: {
                    $lte: new Date(`${date.getFullYear()}-${date.getMonth()+1}-31`)
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
