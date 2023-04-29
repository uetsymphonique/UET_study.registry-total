const randomFunction = require("./randomFunction");
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Owner = require('../models/ownerModel');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const organizations = ['Hợp tác xã', 'Phòng Giáo dục và Đào tạo', 'Nhà máy']
const generateOwner = (role, index) => {
    return {
        name: (role === 'organization') ? organizations[randomFunction.getRandomNumber(0, organizations.length-1)]:randomFunction.createNameOfPerson(),
        phone: randomFunction.createPhoneNumber(),
        email: `${role}${index}@gmail.com`,
        address: randomFunction.createAddress(),
        role: role
    }
}
const owners = [];
const NUM_OF_OWNER_INDIVIDUALS = 3000;
for(let i = 0; i < NUM_OF_OWNER_INDIVIDUALS; i++) {
    owners.push(generateOwner('individual', i));
}
const NUM_OF_OWNER_ORGANIZATIONS = 500;
for(let i = 0; i < NUM_OF_OWNER_ORGANIZATIONS; i++) {
    owners.push(generateOwner('organization', i));
}

fs.writeFileSync(`${__dirname}/owners.json`, JSON.stringify(owners));

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
        await Owner.create(owners);
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await Owner.deleteMany();
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
