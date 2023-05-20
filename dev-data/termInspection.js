const Inspection = require('../models/inspectionModel');
const randomFunction = require('./randomFunction');
const Car = require('../models/carModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const createInspectionNumber = (inspectionDate, index) => {
    return `${inspectionDate.getFullYear()}${index.toString()
        .padStart(6, '0')}`;
}
const createExpiredDate = (inspectionDate, specify) => {
    const str = specify.split('~');
    const expiredTime = parseInt(str[2]);
    const addMonths = (date, months) => {
        const newDate = new Date(date);
        const currMonth = newDate.getMonth();

        newDate.setMonth(currMonth + months);

        // handle edge case where adding months crosses a year boundary
        if (newDate.getMonth() !== (currMonth + months) % 12) {
            newDate.setDate(0); // set to last day of previous month
        }

        return newDate;
    }
    return addMonths(inspectionDate, expiredTime);
}
const createInspection = (car, inspection, index) => {
    const date = inspection.expiredDate;
    const specify = car.getSpecify(date.getFullYear())
    return {
        inspectionNumber: createInspectionNumber(date, index),
        inspectionDate: date,
        car: inspection.car,
        madeBy: inspection.madeBy,
        specify: specify,
        centre: inspection.centre,
        expiredDate: createExpiredDate(date, specify),
        firstTime: false
    }
}

const termInspections = [];

const generate = async () => {
    const oldInspections = await Inspection.find();
    for (let i = 0; i < oldInspections.length - 1; i++) {
        let curr = oldInspections[i];
        // console.log('init:', curr)
        const car = await Car.findById(oldInspections[i].car);
        if (car) console.log(i);
        while (curr.expiredDate < new Date('2023-02-01')) {
            const next = createInspection(car, curr, 0);
            termInspections.push(next);
            curr = next;
        }
        // console.log('end task!');
    }
    // console.log(termInspections);
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
        await Inspection.create(termInspections);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
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