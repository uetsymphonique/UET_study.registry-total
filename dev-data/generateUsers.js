const randomFunction = require("./randomFunction");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./../models/userModel');
const RegistrationCentre = require('./../models/registrationCentreModel');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const generateEmail = (role, index) => {
    return (role === 'admin') ? `admin${index}@vr.com.vn` : `user${index}@vr.com.vn`;
}
const createUser = (role, index, workFor='6442a233b14a706f27fa6a8c') => {
    return {
        ssn: randomFunction.generateUniqueString(-4, 10000000, 99999999),
        name: randomFunction.createNameOfPerson(),
        dateOfBirth: randomFunction.createDate("01/01/1950", "12/31/2003"),
        phone: randomFunction.createPhoneNumber(),
        email: (role === 'admin') ? `admin${index}@vr.com.vn` : `user${index}@vr.com.vn`,
        password: (role === 'admin') ? 'admin@#123' : 'staff@#123',
        role: role,
        passwordConfirm: (role === 'admin') ? 'admin@#123' : 'staff@#123',
        workFor: workFor
    }
}
const users = [];
for (let i = 0; i < 20; i++) {
    users.push(createUser('admin', i));
}
const generateStaffs = async () => {
    let numOfStaffs = 0;
    const centres = await RegistrationCentre.find().select('_id');
    console.log(centres)
    centres.forEach((centre) => {
        for(let i = 0; i < 7; i++) {
            users.push(createUser('staff', numOfStaffs, centre._id));
            numOfStaffs++;
        }
    });
    console.log(`ok! generate: ${numOfStaffs}`);
    console.log(users);
}

// fs.writeFileSync(`${__dirname}/users.json`, JSON.stringify(users));

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
        await generateStaffs();
        await User.create(users);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await User.deleteMany();
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