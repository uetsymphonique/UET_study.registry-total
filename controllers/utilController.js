const provinces = require('./../utils/provinces');
const catchAsync = require('./../utils/catchAsync');
const Address = require('./../models/addressModel');
const factory = require('./../controllers/handleFactory');
const APIFeatures_aggregate = require('./../utils/apiFeatures_aggregate');
exports.getAllProvinces = factory.getAll(Address);
exports.getAllAreas = catchAsync(async (req, res, next) => {
    const features = new APIFeatures_aggregate(Address.aggregate([
        {
            $group: {
                _id: {side: '$side', area: '$area'},
            }
        },
        {$addFields: {side: '$_id.side', area: '$_id.area'}},
        {$project: {_id: 0}},
        {
            $group: {
                _id: '$side',
                areas: {$push: '$area'},
            }
        },
        {$addFields: {side: '$_id'}},
        {$project: {_id: 0}}
    ]), req.query).filter([]);
    const data = await features.query;
    res.status(200)
        .json({
            status: 'success',
            data
        });
});


