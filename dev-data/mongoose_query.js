const Inspection = require('./../models/inspectionModel');
const RegistrationCentre = require('./../models/registrationCentreModel');
const User = require('./../models/userModel');
const Car = require('./../models/carModel');
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
    for (let i = 2009; i < 2022; i++) {
        let cars = await Car.find({
            registrationNumber: new RegExp(`${i}`)
        }).sort({
            registrationDate: 1
        });
        for (let j = 0; j < cars.length; j++) {
            cars[j].registrationNumber = `${i}-${j.toString().padStart(6, '0')}`;
            await cars[j].save({
                validateBeforeSave: false,
            });
        }
    }
}
const run = async () => {
    await query();
    console.log('query done');
}
run();