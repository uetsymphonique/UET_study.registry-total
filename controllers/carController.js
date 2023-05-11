const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Car = require('./../models/carModel');
const factory = require('./handleFactory');
const ApiFeatures = require('./../utils/apiFeatures');
const filterObj = require('./../utils/filterObj');


exports.getAllCars = factory.getAll(Car)
exports.getCar = factory.getOne(Car, {path: 'inspections'});
exports.createCar = factory.createOne(Car);
exports.deleteCar = factory.deleteOne(Car);
exports.updateCar = factory.deleteOne(Car);