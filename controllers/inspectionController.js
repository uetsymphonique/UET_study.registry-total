const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Inspection = require('./../models/inspectionModel');
const APIFeatures = require('./../utils/apiFeatures');
const factory = require('./handleFactory');
const filterObj = require('./../utils/filterObj');
const APIFeatures_aggregate = require('./../utils/apiFeatures_aggregate');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
exports.setAdditionalParams = (req, res, next) => {
    if (!req.params.userId) req.params.userId = req.user._id;
    if (!req.params.centreId) req.params.centreId = req.user.workFor;
    next();
};
exports.setAdditionalPartsInBody = (req, res, next) => {
    if (!req.body.car) req.body.car = req.params.carId;
    if (!req.body.centre) req.body.centre = req.params.centreId;
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

exports.seasonStatsInYearOfCentre = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_matchCentreById(req.params.centreId),
        ...pipeline_getAnalyticsPerYear(req.params.year * 1),
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getSeasonAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                data
            },
        });
});
exports.monthStatsInYearOfCentre = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_matchCentreById(req.params.centreId),
        ...pipeline_getAnalyticsPerYear(req.params.year * 1),
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getMonthAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    console.log(features.query.pipeline());
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                data
            },
        });
});
exports.yearStatsOfCentre = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_matchCentreById(req.params.centreId),
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
exports.monthExpiredStatsInYearOfCentre = catchAsync(async (req, res, next) => {
    console.log(`monthly expired of centre ${req.user.workFor.name}`);
})
exports.monthPredictedStatsInYearOfCentre = catchAsync(async (req, res, next) => {
    console.log(`monthly predicted of centre ${req.user.workFor.name}`);
})


exports.monthStatsInYearOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupCentre,
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
exports.seasonStatsInYearOfAllCentres = catchAsync(async (req, res, next) => {
    // console.log(`seasonly inspected in year ${req.params.year}`);
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupCentre,
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
exports.yearStatsOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupCentre,
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
exports.centreStatsOfAllCentres = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Inspection.aggregate([
        ...pipeline_lookupCentre,
        {
            $addFields: {
                inspectionSeason: {$add: [1, {$floor: {$divide: [{$subtract: [{$month: '$inspectionDate'}, 1]}, 3]}}]},
                inspectionMonth: {$month: '$inspectionDate'},
                inspectionYear: {$year: '$inspectionDate'}
            }
        }
    ]), req.query).prefilter(prefilterFields)
        .push(...pipeline_getCentreAnalytics)
        .filter(prefilterFields)
        .sort()
        .limitFields()
        .paginate();
    // console.log(JSON.stringify(features.query.pipeline()));
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data: {
                data
            },
        });
})
exports.getMonthlyExpiredInspectationsOfCentres = catchAsync(async (req, res, next) => {
    console.log(`monthly expired of centre ${req.user.workFor.name}`);
})
exports.getMonthlyPredictedInspectationsOfCentres = catchAsync(async (req, res, next) => {
    console.log(`monthly predicted of centre ${req.user.workFor.name}`);
});


exports.deleteInspection = factory.deleteOne(Inspection);
exports.updateInspection = factory.updateOne(Inspection);


const prefilterFields = ['centreName', 'centreSide', 'centreArea', 'centreAddress', 'inspectionYear', 'inspectionSeason', 'inspectionMonth'];
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
]
const pipeline_matchCentreById = (id) => [
    {$match: {'centre': new mongoose.Types.ObjectId(id)}},
];
const pipeline_getAnalyticsPerYear = (year) => [
    {$unwind: '$inspectionDate'},
    {
        $match: {
            inspectionDate: {
                $gte: new Date(`${year}-01-01`),
                $lte: new Date(`${year}-12-31`)
            }
        }
    },
]
const pipeline_getSeasonAnalytics = [
    {
        $addFields: {
            inspectionSeason: {$add: [1, {$floor: {$divide: [{$subtract: [{$month: '$inspectionDate'}, 1]}, 3]}}]}
        }
    },
    {
        $group: {
            _id: '$inspectionSeason',
            numOfInspections: {$sum: 1},
            //inspections: {$push: '$inspection_number'},
        },
    },
    {$addFields: {season: '$_id'}},
    {$project: {_id: 0}},
];
const pipeline_getCentreAnalytics = [
    {
        $group: {
            _id: '$centreName',
            numOfInspections: {$sum: 1},
        }
    }, {
        $addFields: {
            centre: '$_id'
        }
    }, {
        $project: {_id: 0}
    }
]
const pipeline_getMonthAnalytics = [
    {
        $group: {
            _id: {$month: '$inspectionDate'},
            numOfInspection: {$sum: 1},
            //inspections: {$push: '$inspection_number'},
        },
    },
    {$addFields: {month: '$_id'}},
    {$project: {_id: 0}},
];
const pipeline_getYearAnalytics = [
    {
        $group: {
            _id: {$year: '$inspectionDate'},
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
];