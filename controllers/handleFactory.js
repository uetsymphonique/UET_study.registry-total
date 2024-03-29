const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const APIFeatures_countDocs = require('./../utils/apiFeatures_countDocs');

exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('Không có bản ghi nào được tìm thấy', 404));
        }

        res.status(204)
            .json({
                status: 'success',
                data: null
            });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!doc) {
            return next(new AppError('Không có bản ghi nào được tìm thấy', 404));
        }

        res.status(200)
            .json({
                status: 'success',
                data: {
                    data: doc
                }
            });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201)
            .json({
                status: 'success',
                data: {
                    data: doc
                }
            });
    });

exports.getOne = (Model, ...popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        popOptions.forEach(popOption => {query = query.populate(popOption)});
        const doc = await query;

        if (!doc) {
            return next(new AppError('Không có bản ghi nào được tìm thấy', 404));
        }

        res.status(200)
            .json({
                status: 'success',
                data: {
                    data: doc
                }
            });
    });

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on tour (hack)
        let filter = {};
        if (req.params.userId) filter.madeBy = req.params.userId;
        if (req.params.carId) filter.car = req.params.carId;
        if (req.params.centreId) filter.centre = req.params.centreId
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        // console.log(await features.query.explain());
        const doc = await features.query;

        // SEND RESPONSE
        res.status(200)
            .json({
                status: 'success',
                results: doc.length,
                data: {
                    data: doc
                }
            });
    });

exports.getNumberOfDocuments = Model =>
    catchAsync(async (req, res, next) => {
        let filter = {};
        if (req.params.userId) filter.madeBy = req.params.userId;
        if (req.params.carId) filter.car = req.params.carId;
        if (req.params.centreId) filter.centre = req.params.centreId
        const features = new APIFeatures_countDocs(Model.where(filter).countDocuments(), req.query).filter();
        // console.log(await features.query.explain());
        const doc = await features.query;

        // SEND RESPONSE
        res.status(200)
            .json({
                status: 'success',
                results: doc
            });
    });
