const randomFunction = require('./randomFunction');
const provinces = require('../utils/provinces');
const fs = require('fs');
const xlsx = require('xlsx');
const createOwner = require('./generateOwners');
const createSpecification = require('./generateSpefications');
const createNumberPlate = () => {
    const regions = ["14", "15", "16", "17", "18", "19", "20", "21", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38"];
    const serialNums = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const serialChars = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M"];
    let region = regions[randomFunction.getRandomNumber(0, regions.length - 1)];
    let serialChar = serialChars[randomFunction.getRandomNumber(0, serialChars.length - 1)];
    let serialNum = serialNums[randomFunction.getRandomNumber(0, serialNums.length - 1)];
    let order = String(randomFunction.getRandomNumber(10000, 99999));
    order = order.slice(0, 3) + "." + order.slice(3, 5);
    return `${region}${serialChar}${serialNum}-${order}`;
}
const createRegistrationDate = (year) => {
    if (year < 2009) year = 2009;
    return new Date(randomFunction.createDate(`${year}-01-01`, "2021-12-31"));
}
const createRegistrationNumber = (date, index) => {
    return `${date.getFullYear()}-${index.toString()
        .padStart(6, '0')}`
}
const createType = () => {
    const types = ['Sedan', 'Hatchback', 'Coupe', 'SUV', 'Minivan', 'Bus', 'Pickup truck', 'Sports car', 'Electric car', 'Luxury car', 'Van'];
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
    return 2023 - Math.floor(Math.random() * 15);
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
const createRecovered = () => {
    const choices = [true, false];
    return choices[randomFunction.getRandomNumber(0, choices.length - 1)];
}

const createCar = (index) => {
    const carType = createType();
    return {
        numberPlate: createNumberPlate(),
        owner: createOwner(index),
        registrationDate: randomFunction.createDate('2023-05-01', '2023-05-31'),
        type: carType,
        brand: createBrand(),
        modelCode: createModelCode(),
        engineNumber: createEngineNumber(),
        chassisNumber: createChassisNumber(),
        color: createColor(),
        manufacturedYear: createManufacturedYear(),
        manufacturedCountry: createManufacturedCountry(),
        boughtPlace: createBoughtPlace(),
        purpose: createPurpose(),
        specification: createSpecification(carType),
        recovered: createRecovered()
    }
};

const cars = [];

for (let i = 9500; i < 9550; i++) {
    cars.push(createCar(i));
}

const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
        const propKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            Object.assign(acc, flattenObject(obj[key], propKey));
        } else {
            acc[propKey] = obj[key];
        }
        return acc;
    }, {});
};

const flattenedData = cars.map(obj => flattenObject(obj));
const headers = Object.keys(flattenedData[0]);

const worksheet = xlsx.utils.json_to_sheet(flattenedData, { header: headers });
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

const xlsxData = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });

fs.writeFileSync(`${__dirname}/data7.xlsx`, xlsxData);