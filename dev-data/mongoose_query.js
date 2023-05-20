const Inspection = require('./../models/inspectionModel');
const RegistrationCentre = require('./../models/registrationCentreModel');
const User = require('./../models/userModel');
const Car = require('./../models/carModel');
const provinces = require('./../utils/provinces')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
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


const query = async () => {
    // for (let i = 2022; i < 2024; i++) {
    //     let cars = await Car.find({
    //         registrationNumber: new RegExp(`^${i}`)
    //     }).sort({
    //         registrationDate: 1
    //     });
    //     for (let j = 0; j < cars.length; j++) {
    //         cars[j].registrationNumber = `${i}-${j.toString().padStart(6, '0')}`;
    //         await cars[j].save({
    //             validateBeforeSave: false,
    //         });
    //     }
    // }

    for (let i = 2022; i < 2024; i++) {
        let inspections = await Inspection.find({
            inspectionNumber: new RegExp(`^${i}`)
        }).sort({
            inspectionDate: 1
        });
        for (let j = 0; j < inspections.length; j++) {
            inspections[j].inspectionNumber = `${i}-${j.toString().padStart(6, '0')}`;
            await inspections[j].save({
                validateBeforeSave: false,
            });
        }
    }


    // const inspections = await Inspection.aggregate()
    //     .group({
    //         _id: '$car',
    //     });
    // for (let i = 0; i < inspections.length; i++) {
    //     const car = await Car.findById(inspections[i]._id);
    //     car.inspected = true;
    //     await car.save({
    //         validateBeforeSave: false,
    //     });
    // }

    // const cars = await Car.find({inspected: false});
    // for (let i = 0; i < cars.length; i++) {
    //     cars[i].predictedAddress = cars[i].owner.address.split(', ')[2];
    //     if (i === 0) {
    //         console.log(cars[i].predictedAddress);
    //     }
    //     cars[i].predictedArea = provinces.mappingProvinceToArea(cars[i].owner.address.split(', ')[2]);
    //     cars[i].predictedSide = provinces.mappingProvinceToSide(cars[i].owner.address.split(', ')[2]);
    //     // console.log(cars[i]);
    //     await cars[i].save({
    //         validateBeforeSave: false
    //     });
    // }
}

const run = async () => {
    await query();
    console.log('query done');
}
run();