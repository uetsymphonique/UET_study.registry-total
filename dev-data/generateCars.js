const randomFunction = require("./randomFunction");
const fs = require('fs');
const mongoose = require('mongoose');
const Owner = require('./../models/ownerModel');
const Car = require('./../models/carModel');
const provinces = require('./../utils/provinces')
const generateSpecifications = require('./generateSpefications');
const createRegistrationCertificate = require('./generateRegistrationCertificates');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const createNumberPlate = () => {
    const regions = ["14", "15", "16", "17", "18", "19", "20", "21", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"];
    const serialNums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const serialChars = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M"];
    let region = regions[randomFunction.getRandomNumber(0, regions.length - 1)];
    let serialChar = serialChars[randomFunction.getRandomNumber(0, serialChars.length - 1)];
    let serialNum = serialNums[randomFunction.getRandomNumber(0, serialNums.length - 1)];
    let order = String(randomFunction.getRandomNumber(10000, 99999));
    order = order.slice(0, 3) + "." + order.slice(3, 5);
    return `${region}${serialChar}${serialNum} - ${order}`;
}
const createType = () => {
    const types = ['Sedan', 'Hatchback', 'Coupe', 'SUV', 'Minivan', 'Bus', 'Pickup truck', 'Sports car', 'Electric car','Luxury car', 'Van'];
    return types[randomFunction.getRandomNumber(0, types.length - 1)];
}
const createBrand = () => {
    const brands = ['Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ford', 'Ferrari', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Kia', 'Land Rover', 'Lexus', 'Lamborghini', 'Maserati', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Pontiac', 'Porsche', 'Renault', 'Rolls-Royce', 'Saab', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo']
    return brands[randomFunction.getRandomNumber(0, brands.length - 1)];
}
const createModelCode = () => {
    return randomFunction.getRandomString(12);
}
const createEngineNumber = () => {
    return Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();
}
const createChassisNumber = () => {
    return Math.random()
        .toString(36)
        .substring(2, 15)
        .toUpperCase();
}
const createColor = () => {
    const colors = ['white', 'black', 'silver', 'red', 'blue', 'grey'];
    return colors[randomFunction.getRandomNumber(0, colors.length - 1)];
}
const createManufacturedYear = () => {
    return 2020 - Math.floor(Math.random() * 30);
}
const createManufacturedCountry = () => {
    const countries = ['Nhật Bản', 'Hàn Quốc', 'Thái Lan', 'Trung Quốc', 'Mỹ', 'Anh', 'Đức', 'Việt Nam', 'Ý'];
    return countries[randomFunction.getRandomNumber(0, countries.length - 1)];
}
const createBoughtPlace = () => {
    const p = provinces.getProvinceNames();
    return p[randomFunction.getRandomNumber(0, p.length - 1)];
}
const createPurpose = () => {
    const purposes = ['personal', 'business'];
    return purposes[randomFunction.getRandomNumber(0, purposes.length - 1)];
}
const createSpecification = (carType) => {
    return generateSpecifications.generateSpecificationForCarType(carType);
}


const createCar = async (owner, manYear) => {
    const type = createType();
    return {
        number_plate: createNumberPlate(),
        owner: owner,
        type: type,
        brand: createBrand(),
        model_code: createModelCode(),
        engine_number: createEngineNumber(),
        chassis_number: createChassisNumber(),
        color: createColor(),
        manufactured_year: manYear,
        manufactured_country: createManufacturedCountry(),
        bought_place: createBoughtPlace(),
        purpose: createPurpose(),
        specification: createSpecification(type),
        registration_certificate: await createRegistrationCertificate(manYear)
    }
};
const createRandomCar = async (owner, manYear) => {
    const type = createType();
    return {
        number_plate: createNumberPlate(),
        owner: owner,
        type: type,
        brand: createBrand(),
        model_code: createModelCode(),
        engine_number: createEngineNumber(),
        chassis_number: createChassisNumber(),
        color: createColor(),
        manufactured_year: manYear,
        manufactured_country: createManufacturedCountry(),
        bought_place: createBoughtPlace(),
        purpose: createPurpose(),
        specification: generateSpecifications.createSpecification(type),
        registration_certificate:await createRegistrationCertificate(manYear)
    }
}

const NUM_OF_CARS = 6500;
const generateCar = async () => {
    const owners = await Owner.find()
        .select('_id');
    for (let i = 3513; i < 4000; i++) {
        const year = createManufacturedYear();
        const car = await createCar(owners[i % owners.length]._id, year);
        await Car.create(car);
    }
    for (let i = 4000; i < NUM_OF_CARS; i++) {
        const year = createManufacturedYear();
        const car = await createRandomCar(owners[i % owners.length]._id, year);
        await Car.create(car);
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
        await generateCar();
        console.log('data successfully loaded');
        process.exit(0);
    } catch (err) {
        console.log(err.message);
    }
};
const deleter = async () => {
    try {
        await Car.deleteMany();
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



