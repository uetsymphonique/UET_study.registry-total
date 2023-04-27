const randomFunction = require("./randomFunction");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const RegistrationCentre = require('../models/registrationCentreModel');
const dotenv = require('dotenv');
const formatVietnameseString = require('../utils/formatVienameseString');
const validator = require('validator');
const email = (name) => {
    const excludedStrings = 'Trung tâm đăng kiểm Tỉnh Thành phố số'.split(' ');

    let ans = [];
    name.replace('-', ' ').split(' ')
        .forEach((str) => {
            if(!excludedStrings.includes(str) && validator.isAlphanumeric(formatVietnameseString(str))) {
                ans.push(formatVietnameseString(str));
            }
        })
    return `registry${ans.join('')}@vr.com.vn`;
};
dotenv.config({path: './config.env'});
const createRegistrationCentres = (isAdmin, province = null, indexMail = 0, indexCentre=1) => {
    return {
        name: isAdmin ? "Cục đăng kiểm Việt Nam" : `Trung tâm đăng kiểm ${province} số ${indexCentre}`,
        address: isAdmin ? "Thành phố Hà Nội" : province,
        phone: randomFunction.createPhoneNumber(),
        email: isAdmin ? "registrytotal@vr.com.vn" : email(`Trung tâm đăng kiểm ${province} số ${indexCentre}`),
    }
}
const pcvn = require('pc-vn');
const getProvinceNames = () => {
    let ret = [];
    pcvn.getProvinces()
        .forEach((province) => {
            ret.push(province.name);
        });
    return ret;
}
let provinces = getProvinceNames();
console.log(provinces);

let centres = [];
centres.push(createRegistrationCentres(true));
for (let i = 0; i < provinces.length; i++) {
    centres.push(createRegistrationCentres(false, provinces[i], i, 1));
    centres.push(createRegistrationCentres(false, provinces[i], i, 2));
}
fs.writeFileSync(`${__dirname}/registrationCentres.json`, JSON.stringify(centres));

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
        await RegistrationCentre.create(centres);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await RegistrationCentre.deleteMany();
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
