const Inspection = require('./../models/inspectionModel');
const Inspect = require('./../models/inspectModel');
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
    await Car.updateMany({},
        {$unset: {
                'specification._id': 1,
                'registration_certificate._id': 1
            }}
    );
    console.log('query done');
}

query();