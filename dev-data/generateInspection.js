const Inspection = require('../models/inspectionModel');
const randomFunction = require('./randomFunction');
const Car = require('../models/carModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const createInspectionDate = (date) => {
    const startDate = new Date(date);
    if (startDate.getFullYear() < 2014){
        startDate.setFullYear(2014);
    }
    if (startDate.getFullYear() < 2021){
        return new Date(randomFunction.createDate(startDate, `${startDate.getFullYear()+1}-12-31`));
    } else {
        return new Date(randomFunction.createDate(startDate, `${startDate.getFullYear()}-02-03`));
    }
}
const createInspectionNumber = (inspectionDate, index) => {
    return `${inspectionDate.getFullYear()}-${index.toString().padStart(6, '0')}`;
}

const createInspection = (car, user, index) => {
    const date = createInspectionDate(car.registrationDate);
    return {
        inspectionNumber:createInspectionNumber(date,index),
        inspectionDate: date,
        car: car._id,
        madeBy: user._id,
        // specify: car.getSpecify(date.getFullYear()),
        // centre: user.workFor,
    }
}

const inspections = [];
const NUM_OF_INSPECTIONS = 7000;
const generate = async () => {
    const cars = await Car.find({inspected: false, registrationNumber: {$regex: new RegExp('^2023-')}});
    const users = await User.find({role: 'staff'});
    for (let i = 0; i < cars.length/5*3; i++){
        inspections.push(createInspection(cars[i],users[randomFunction.getRandomNumber(0, users.length - 1)],i));
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
        await generate();
        await Inspection.create(inspections);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await Inspection.deleteMany({
            inspectionNumber: { $regex: new RegExp('^2023-')},
            firstTime: true
        });
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