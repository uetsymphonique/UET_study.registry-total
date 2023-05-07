const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Inspection = require('./../models/inspectionModel');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');
const ApiFeatures_aggregate = require('./../utils/apiFeatures_aggregate')

exports.getAllInspections = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Inspection.find()
        .populate('madeBy', '-__v')
        .populate('car', '-__v'), req.query)
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
});

exports.getSeasonAnalyticsPerYearByOwnId = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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
    const features = new ApiFeatures_aggregate(Inspection.aggregate([
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