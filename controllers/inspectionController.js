const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Inspection = require('./../models/inspectionModel');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handleFactory');
const filterObj = require('./../utils/filterObj');
const APIFeatures_aggregate = require('./../utils/apiFeatures_aggregate');
exports.setAdditionalParams = (req, res, next) => {
    if(!req.params.userId) req.params.userId = req.user._id;
    next();
};
exports.setAdditionalPartsInBody = (req, res, next) => {
    if(!req.body.car) req.body.car = req.params.carId;
    if(!req.body.centre) req.body.centre = req.params.centreId;
    next();
}
exports.getAllInspections = factory.getAll(Inspection)
exports.getInspection = factory.getOne(Inspection,
    {
        path: 'madeBy',
        populate: {
            path: 'workFor',
            select: '-side -slug -area -id -address -_id'
        }
    }, {
        path: 'car',
        select: '-id'
    }
);
exports.createInspection = factory.createOne(Inspection);
exports.makeInspection = catchAsync(async (req, res, next) => {
    const doc = await Inspection.create({
        car: req.body.car,
        madeBy: req.user._id,
    });
    res.status(201)
        .json({
            status: 'success',
            data: {
                data: doc
            }
        });
});

exports.getSeasonAnalyticsPerYearByOwnId = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_getAnalyticsForOwnCentreById(req.user.workFor._id),
        ...pipeline_getAnalyticsPerYear(req.params.year * 1),
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getSeasonAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getMonthAnalyticsPerYearByOwnId = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_getAnalyticsForOwnCentreById(req.user.workFor._id),
        ...pipeline_getAnalyticsPerYear(req.params.year * 1),
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getMonthAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getYearAnalyticsByOwnId = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_getAnalyticsForOwnCentreById(req.user.workFor._id),
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getYearAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getMonthlyExpiredAnalyticsPerYearByOwnId = catchAsync(async (req, res, next) => {
    console.log(`monthly expired of centre ${req.user.workFor.name}`);
})
exports.getMonthlyPredictedAnalyticsPerYearByOwnId = catchAsync(async (req, res, next) => {
    console.log(`monthly predicted of centre ${req.user.workFor.name}`);
})


exports.getMonthlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_lookupWorkFor,
        ...pipeline_getAnalyticsPerYear(req.params.year * 1)
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getMonthAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    //console.log(JSON.stringify(features.query));
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getSeasonlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    // console.log(`seasonly inspected in year ${req.params.year}`);
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_lookupWorkFor,
        ...pipeline_getAnalyticsPerYear(req.params.year * 1)
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getSeasonAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    //console.log(JSON.stringify(features.query));
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getYearlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupMadeBy,
        ...pipeline_lookupWorkFor,
    ]), req.query).prefilter(prefilterFields)
        .push(
            ...pipeline_getYearAnalytics
        )
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    //console.log(JSON.stringify(features.query));
    const analytics = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getMonthlyExpiredInspectationsOfCentres = catchAsync(async (req, res, next) => {
    console.log(`monthly expired of centre ${req.user.workFor.name}`);
})
exports.getMonthlyPredictedInspectationsOfCentres = catchAsync(async (req, res, next) => {
    console.log(`monthly predicted of centre ${req.user.workFor.name}`);
});


exports.deleteInspection = factory.deleteOne(Inspection);
exports.updateInspection = factory.updateOne(Inspection);


const prefilterFields = ['registration_name', 'registration_side', 'registration_area', 'registration_address'];
const pipeline_lookupMadeBy = [
    {
        $lookup: {
            from: 'users',
            localField: 'madeBy',
            foreignField: '_id',
            as: 'user'
        }
    },
    {$unwind: '$user'},
]
const pipeline_lookupWorkFor = [
    {
        $lookup: {
            from: 'registrationcentres',
            localField: 'user.workFor',
            foreignField: '_id',
            as: 'registration_centre'
        }
    }, {$unwind: '$registration_centre'},
    {
        $addFields: {
            registration_name: '$registration_centre.name',
            registration_side: '$registration_centre.side',
            registration_area: '$registration_centre.area',
            registration_address: '$registration_centre.address'
        }
    }
]
const pipeline_getAnalyticsForOwnCentreById = (id) => [
    {$match: {'user.workFor': id}}
];
const pipeline_getAnalyticsPerYear = (year) => [
    {$unwind: '$inspected_date'},
    {
        $match: {
            inspected_date: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        }
    },
]
const pipeline_getSeasonAnalytics = [
    {
        $addFields: {
            inspected_season: {$add: [1, {$floor: {$divide: [{$subtract: [{$month: '$inspected_date'}, 1]}, 3]}}]}
        }
    },
    {
        $group: {
            _id: '$inspected_season',
            numOfInspection: {$sum: 1},
            //inspections: {$push: '$inspection_number'},
        },
    },
    {$addFields: {season: '$_id'}},
    {$project: {_id: 0}},
    {$sort: {season: 1}}
];
const pipeline_getMonthAnalytics = [
    {
        $group: {
            _id: {$month: '$inspected_date'},
            numOfInspection: {$sum: 1},
            //inspections: {$push: '$inspection_number'},
        },
    },
    {$addFields: {month: '$_id'}},
    {$project: {_id: 0}},
    {$sort: {month: 1}}
];
const pipeline_getYearAnalytics = [
    {
        $group: {
            _id: {$year: '$inspected_date'},
            numOfInspection: {$sum: 1},
            //inspections: {$push: '$inspection_number'},
        }
    },
    {
        $addFields: {
            year: '$_id',
            // numericString: {$toInt: '3'}
        }
    },
    {$project: {_id: 0}},
    // {
    //     $match: {
    //         numOfInspection: {
    //             $gte: 3,
    //             // $gte: { $convert: { input: '3', to: "int" } },
    //         }
    //     }
    // }
    //{$sort: {year: 1}}
];