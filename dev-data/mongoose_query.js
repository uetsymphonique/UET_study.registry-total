const Inspection = require('../models/inspectionModel');
const Inspect = require('../models/inspectModel');
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

const mergeInspection = async () => {
    const inspects = await Inspect.find();
    for (let i = 0; i < inspects.length; i++) {
        await Inspection.findByIdAndUpdate(inspects[i].inspection,{
            car: inspects[i].car,
            madeBy: inspects[i].staff
        })
    }
}

//mergeInspection();

const query = async () => {
    await mergeInspection();
    console.log('query done');
}

query();