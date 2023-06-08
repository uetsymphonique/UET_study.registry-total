const mongoose = require('mongoose');
const dotenv = require('dotenv');
const provinces = require('./../utils/provinces');
const Address = require('../models/addressModel');
dotenv.config({path: './config.env'});

const data = [];
for (const province of provinces.getProvinceNames()){
    data.push({
        province: province,
        area: provinces.mappingProvinceToArea(province),
        side: provinces.mappingProvinceToSide(province)
    })
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
        await Address.create(data);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await Address.deleteMany();
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