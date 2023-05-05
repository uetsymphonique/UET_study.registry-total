const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Inspection = require('./../models/inspectionModel');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');
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
const getSeasonAnalyticsPerYearById = async (year, id) => {
    const analytics = await Inspection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'madeBy',
                foreignField: '_id',
                as: 'user'
            }
        },
        {$unwind: '$user'},
        {
            $match: {
                'user.workFor': id,
                inspected_date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
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
    ]);
    return analytics;
}
const getMonthAnalyticsPerYearById = async (year, id) => {
    const analytics = await Inspection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'madeBy',
                foreignField: '_id',
                as: 'user'
            }
        },
        {$unwind: '$user'},
        {$unwind: '$inspected_date'},
        {
            $match: {
                'user.workFor': id,
                inspected_date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                },
            }
        },
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
    ]);
    return analytics;
}
const getYearAnalyticsById = async (id) => {
    const analytics = await Inspection.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'madeBy',
                foreignField: '_id',
                as: 'user'
            }
        },
        {$unwind: '$user'},
        {$unwind: '$inspected_date'},
        {
            $match: {
                'user.workFor': id
            }
        },
        {
            $group: {
                _id: {$year: '$inspected_date'},
                numOfInspection: {$sum: 1},
                //inspections: {$push: '$inspection_number'},
            }
        },
        {$addFields: {year: '$_id'}},
        {$project: {_id: 0}},
        {$sort: {year: 1}}
    ]);
    return analytics
}

exports.getMonthlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Inspection.aggregate([
        {$unwind: '$inspected_date'},
        {
            $match: {
                inspected_date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                },
            }
        },
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
    ]);
    res.status(200)
        .json({
            status: 'success',
            data: {
                plan
            },
        });
});
exports.getSeasonlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    // console.log(`seasonly inspected in year ${req.params.year}`);
    const year = req.params.year * 1;
    const plan = await Inspection.aggregate([
        {$unwind: '$inspected_date'},
        {
            $match: {
                inspected_date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
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
    ]);
    res.status(200)
        .json({
            status: 'success',
            data: {
                plan
            },
        });
});
exports.getYearlyInspectionsOfCentres = catchAsync(async (req, res, next) => {
    //console.log(`yearly inspected of centre ${req.user.workFor.name}`);
    const analytics = await Inspection.aggregate([
        {$unwind: '$inspected_date'},
        {
            $group: {
                _id: {$year: '$inspected_date'},
                numOfInspection: {$sum: 1},
                //inspections: {$push: '$inspection_number'},
            }
        },
        {$addFields: {year: '$_id'}},
        {$project: {_id: 0}},
        {$sort: {year: 1}}
    ]);
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


exports.getSeasonlyInspectionsOfCentre = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const analytics = await getSeasonAnalyticsPerYearById(year, req.user.workFor._id);
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getMonthlyInspectionsOfCentre = catchAsync(async (req, res, next) => {
    //console.log(`monthly inspected in year ${req.params.year} of centre ${req.user.workFor.name}`);
    const year = req.params.year * 1;
    const analytics = await getMonthAnalyticsPerYearById(year, req.user.workFor._id);
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        });
});
exports.getYearlyInspectionsOfCentre = catchAsync(async (req, res, next) => {
    // console.log(`yearly inspected of centre ${req.user.workFor.name}`);
    const analytics = await getYearAnalyticsById(req.user.workFor._id);
    res.status(200)
        .json({
            status: 'success',
            data: {
                analytics
            },
        })
});
exports.getMonthlyExpiredInspectationsOfCentre = catchAsync(async (req, res, next) => {
    console.log(`monthly expired of centre ${req.user.workFor.name}`);
})
exports.getMonthlyPredictedInspectationsOfCentre = catchAsync(async (req, res, next) => {
    console.log(`monthly predicted of centre ${req.user.workFor.name}`);
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