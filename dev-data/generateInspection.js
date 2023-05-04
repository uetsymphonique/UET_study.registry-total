const Inspection = require('../models/inspectionModel');
const Inspect = require('../models/inspectModel');
const randomFunction = require('server/dev-data/randomFunction');
const Car = require('../models/carModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


const getSpecifyForCar = (car, recovered) => {
    let speType;
    if (car.type === 'Minivan' || car.type === 'Pickup truck' || car.type === 'Van') {
        speType = 'truck_specializedCar'
    } else {
        speType = 'carry_people';
    }
    let speCarry = '';
    if (speType === 'carry_people') {
        speCarry = (car.specification.permissible_carry > 9) ? '$gt:9' : '$lte:9';
    }
    let spePurpose = '';
    if (speCarry === '$lte:9') {
        spePurpose = `-${car.purpose}`;
    }
    let speManufactureAndTimePeriod = '';
    if (speType === 'carry_people') {
        if (speCarry === '$lte:9') {
            if (spePurpose === '-personal') {
                if (car.manufactured_year <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~36~24';
                else if (car.manufactured_year <= 20) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:20~12~12';
                else speManufactureAndTimePeriod = '+manufacture$gt:20~6~6';
            } else {
                if (recovered) speManufactureAndTimePeriod = '+recovered~12~6';
                else if (car.manufactured_year <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12'
                else speManufactureAndTimePeriod = '+manufacture$gt:5~6~6';
            }
        } else {
            if (recovered) speManufactureAndTimePeriod = '+recovered~12~6';
            else if (car.manufactured_year <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12';
            else if (car.manufactured_year <= 14) speManufactureAndTimePeriod = '+manufacture$gt:5and$lte:14~6~6';
            else speManufactureAndTimePeriod = '+manufacture$gt:14~3~3';
        }
    } else {
        if (recovered) speManufactureAndTimePeriod = '+recovered~12~6';
        else if (car.manufactured_year <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~24~12';
        else if (car.manufactured_year <= 19) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:19~6~6';
        else speManufactureAndTimePeriod = '+manufacture$gt:19~3~3';
    }
    return `${speType}${speCarry}${spePurpose}${speManufactureAndTimePeriod}`;
}
const createInspection = async (car, date) => {
    return {
        inspected_date: date,
        specify: getSpecifyForCar(car),
        firstTime: (!await Inspect.findOne({car: car._id}))
    }
}
const makeInspection = (car, staff, inspection) => {
    return {
        car: car._id,
        staff: staff._id,
        inspection: inspection._id
    }
}

const inspects = async () => {
    const cars = await Car.find();
    const staffs = await User.find({role: 'staff'});
    for (let i = 0; i < cars.length; i++) {
        const inspection = await Inspection.create(await createInspection(cars[i],
            randomFunction.createDate(cars[i].registration_certificate.registration_date, '2021-12-31')));
        await Inspect.create(makeInspection(cars[i],
            staffs[randomFunction.getRandomNumber(0, staffs.length - 1)],
            inspection));
    }
}
const database = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(database, {
        useNewUrlParser: true,
    })
    .then((conn) => {
        //console.log(conn.connections);
        console.log('Database connected successfully!!');
    })
    .catch((err) => {
        console.log('Database connected unsuccessfully!! ERROR: ' + err.message);
    });

const importer = async () => {
    try {
        await inspects();
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await Inspect.deleteMany();
        await Inspection.deleteMany();
        console.log('data successfully deleted!');
        process.exit(0);
    } catch (error) {
        console.log(error.message);
    }
};

if (process.argv[2] === '--import') {
    importer();
} else if (process.argv[2] === '--delete') {
    deleter();
}
console.log(process.argv);