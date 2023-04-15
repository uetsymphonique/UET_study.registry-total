const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var rand = require('random-seed').create();

mongoose.connect('mongodb://localhost/testvcl', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// const db = mongoose.connection;
// db.dropDatabase();

const CarOwners = require('./models/CarOwners');
const Cars = require('./models/Cars');
const Staff = require('./models/Staff');
const Person = require('./models/Person');
const Registry = require('./models/Registry');
const RegistryOffice = require('./models/RegistryOffice');

async function createCollection() {
    Person.createCollection().then(function (collection) {
        console.log('Person is created!');
    });

    CarOwners.createCollection().then(function (collection) {
        console.log('CarOwners is created!');
    });

    Cars.createCollection().then(function (collection) {
        console.log('Cars is created!');
    });

    Staff.createCollection().then(function (collection) {
        console.log('Staff is created!');
    });

    Registry.createCollection().then(function (collection) {
        console.log('Registry is created!');
    });

    RegistryOffice.createCollection().then(function (collection) {
        console.log('RegistryOffice is created!');
    });
}

const getRandomNumber = (min, max) => {
    return rand.intBetween(min, max);
};

const getRandomString = (length) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
};

function generateUniqueString(lastDigit, min, max) {
    const timestamp = new Date().getTime().toString().slice(lastDigit);
    const randomNum = getRandomNumber(min, max);
    return String(timestamp) + String(randomNum);
};


function createDate(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    var month = String(randomDate.getMonth() + 1).padStart(2, '0'); // January is 0
    var day = String(randomDate.getDate()).padStart(2, '0');
    var year = randomDate.getFullYear();
    var date = month + '/' + day + '/' + year;
    return date;
}

function createPerson() {
    var ho = ["Nguyen", "Ngo", "Le", "Tran", "Bui", "Ly", "Trieu"];
    var dem = ["Van", "Thi"];
    var ten = ["Linh", "Nam", "Minh", "Cuong", "Hai", "Ha", "Son", "Hoa", "Trung", "Huong"];
    var namel1 = ho.length;
    var namel2 = dem.length;
    var namel3 = ten.length;
    var rand1 = Math.floor(Math.random() * namel1);
    var rand2 = Math.floor(Math.random() * namel2);
    var rand3 = Math.floor(Math.random() * namel3);
    var name = ho[rand1] + " " + dem[rand2] + " " + ten[rand3];
    var dob = createDate("01/01/1950", "12/31/2003");
    var ssn = generateUniqueString(-6, 100000, 999999);
    var sdt = "0" + generateUniqueString(-4, 10000, 99999);
    var person = ({
        name: name,
        dateOfBirth: dob,
        SSN: ssn,
        phone: sdt
    });
    // Person.create(person);
    return person;
}

function createSpecification() {
    const wheelFormulas = ['4x2', '4x4', '6x4', '6x6'];
    const fuels = ['Gasoline', 'Diesel', 'Electric'];
    const numberOfTires = [4, 6, 8];
    const tireSizes = ["205/55R16", "225/65R17", "235/45R18", "265/70R16", "215/60R16", "225/40R18"];
    var specification = {
        wheelFormula: wheelFormulas[getRandomNumber(0, 3)],
        wheelTread: `${getRandomNumber(1400, 2000)} mm`,
        overallDimension: `${getRandomNumber(3500, 5000)} x ${getRandomNumber(1500, 2200)} x ${getRandomNumber(1200, 1800)} mm`,
        containerDimension: `${getRandomNumber(1500, 2500)} x ${getRandomNumber(1000, 1500)} x ${getRandomNumber(800, 1200)} mm`,
        lengthBase: `${getRandomNumber(2400, 3200)} mm`,
        kerbMass: `${getRandomNumber(800, 1600)} kg`,
        authorizedPayload: `${getRandomNumber(500, 1000)} kg`,
        authorizedTotalMass: `${getRandomNumber(1500, 3000)} kg`,
        authorizedTowedMass: `${getRandomNumber(1000, 2000)} kg`,
        permissibleCarry: `${getRandomNumber(4, 7)}`,
        fuel: fuels[getRandomNumber(0, 2)],
        engineDisplacement: `${getRandomNumber(1000, 2000)} cc`,
        maxOutputToRpmRatio: `${getRandomNumber(50, 150)}/${getRandomNumber(4000, 7000)}`,
        numberOfTiresAndTireSize: `${numberOfTires[getRandomNumber(0, 2)]} - ${tireSizes[getRandomNumber(0, 5)]}`
    }
    return specification;
}

function getRandomNumberPlate() {
    const regionCodes = ["29", "30", "31", "32", "33", "34", "35", "36", "37", "38"];
    const serialNum = ["1", "2", "3", "4", "5", "6"];
    const serialChar = ["A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M"];

    let plateNumber = '';
    let region = regionCodes[getRandomNumber(0, 9)];
    let serichar = serialChar[getRandomNumber(0, 10)];
    let serinum = serialNum[getRandomNumber(0, 5)];
    let order = String(getRandomNumber(10000, 99999));
    order = order.slice(0, 3) + "." + order.slice(3, 5);

    plateNumber = region + serichar + serinum + " - " + order;
    return plateNumber;
}

function createCars(numberPlate, index) {
    var specification = createSpecification();
    var registrationCert = {
        number: index,
        registrationDate: createDate("01/01/2020", "03/31/2023"),
    }
    var owner = "123456789123";
    var types = ['Sedan', 'SUV', 'Hatchback', 'Pickup Truck'];
    var brands = ['Toyota', 'Honda', 'Kia', 'Ford', 'Hyundai', 'Mitsubishi'];
    var colors = ['white', 'black', 'silver', 'red', 'blue', 'grey'];
    var countries = ['Japan', 'Korea', 'Thailand'];
    var places = ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Can Tho'];
    var purposes = ['personal', 'business'];

    var type = types[Math.floor(Math.random() * types.length)];
    var brand = brands[Math.floor(Math.random() * brands.length)];
    var modelCode = getRandomString(12);
    var engineNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    var chassisNumber = Math.random().toString(36).substring(2, 15).toUpperCase();
    var color = colors[Math.floor(Math.random() * colors.length)];
    var manufacturedYear = 2021 - Math.floor(Math.random() * 20);
    var manufacturedCountry = countries[Math.floor(Math.random() * countries.length)];
    var boughtPlace = places[Math.floor(Math.random() * places.length)];
    var purpose = purposes[Math.floor(Math.random() * purposes.length)];
    Cars.create({
        numberPlate: numberPlate,
        owner: owner,
        type: type,
        brand: brand,
        modelCode: modelCode,
        engineNumber: engineNumber,
        chassisNumber: chassisNumber,
        color: color,
        manufacturedCountry: manufacturedCountry,
        manufacturedYear: manufacturedYear,
        registrationCert: registrationCert,
        specification: specification,
        boughtPlace: boughtPlace,
        purpose: purpose
    });
}

async function createStaff(index, isAdmin) {
    var data = createPerson();
    var email = "@gmail.com";
    if (isAdmin == 0) {
        email = "staff" + String(index) + email;
    } else {
        email = "admin" + String(index) + email;
    }
    var password = "12345678";
    var workFor = "123456789123";
    Staff.create({
        data: data,
        isAdmin: isAdmin,
        email: email,
        password: password,
        workFor: workFor
    });
}

function createCarOwners(index) {
    var data = createPerson();
    var email = "user" + String(index) + "@gmail.com";
    var OwnedCar = "123456789123";
    CarOwners.create({
        data: data,
        email: email,
        ownedCar: OwnedCar
    });
}

function createRegistryOffice(isAdmin, officeNum) {
    var province = ["Thành phố Hà Nội", "Tỉnh Hà Giang", "Tỉnh Cao Bằng", "Tỉnh Bắc Kạn", "Tỉnh Tuyên Quang", "Tỉnh Lào Cai", "Tỉnh Điện Biên", "Tỉnh Lai Châu", "Tỉnh Sơn La", "Tỉnh Yên Bái", "Tỉnh Hoà Bình", "Tỉnh Thái Nguyên", "Tỉnh Lạng Sơn", "Tỉnh Quảng Ninh", "Tỉnh Bắc Giang", "Tỉnh Phú Thọ", "Tỉnh Vĩnh Phúc", "Tỉnh Bắc Ninh", "Tỉnh Hải Dương", "Thành phố Hải Phòng", "Tỉnh Hưng Yên", "Tỉnh Thái Bình", "Tỉnh Hà Nam", "Tỉnh Nam Định", "Tỉnh Ninh Bình", "Tỉnh Thanh Hóa", "Tỉnh Nghệ An", "Tỉnh Hà Tĩnh", "Tỉnh Quảng Bình", "Tỉnh Quảng Trị", "Tỉnh Thừa Thiên Huế", "Thành phố Đà Nẵng", "Tỉnh Quảng Nam", "Tỉnh Quảng Ngãi", "Tỉnh Bình Định", "Tỉnh Phú Yên", "Tỉnh Khánh Hòa", "Tỉnh Ninh Thuận", "Tỉnh Bình Thuận", "Tỉnh Kon Tum", "Tỉnh Gia Lai", "Tỉnh Đắk Lắk", "Tỉnh Đắk Nông", "Tỉnh Lâm Đồng", "Tỉnh Bình Phước", "Tỉnh Tây Ninh", "Tỉnh Bình Dương", "Tỉnh Đồng Nai", "Tỉnh Bà Rịa - Vũng Tàu", "Thành phố Hồ Chí Minh", "Tỉnh Long An", "Tỉnh Tiền Giang", "Tỉnh Bến Tre", "Tỉnh Trà Vinh", "Tỉnh Vĩnh Long", "Tỉnh Đồng Tháp", "Tỉnh An Giang", "Tỉnh Kiên Giang", "Thành phố Cần Thơ", "Tỉnh Hậu Giang", "Tỉnh Sóc Trăng", "Tỉnh Bạc Liêu", "Tỉnh Cà Mau"];
    var map = {

    };
    for (var i = 0; i < 63; i++) {
        map[province[i]] = 0;
    }
    for (var i = 0; i < officeNum; i++) {
        var name = "";
        var address = "Thành phố Hà Nội";
        if (isAdmin == 1) {
            name = "Cục đăng kiểm Việt Nam";
        } else {
            address = province[getRandomNumber(0, 62)];
            map[address]++;
            name = `Trung tâm đăng kiểm số ${map[address]} ${address}`;
        }
        var hotline = "0" + generateUniqueString(-6, 100, 999);
        var hotmail = `randomemail${i + 1}@gmail.com`;
        if (isAdmin == 1) {
            hotmail = "registrytotal@vr.com.vn";
        }
        var staff = [];
        RegistryOffice.create({
            name: name,
            address: address,
            isAdmin: isAdmin,
            hotline: hotline,
            hotMail: hotmail,
            staff: staff
        });
    }
}

function createRegistry() {
    var regisPlace = "123456789123";
    var car = "123456789123";
    var regisDate = new Date();
    var expiredDate = new Date(regisDate.getTime());
    expiredDate.setMonth(regisDate.getMonth() + 18);
    Registry.create({
        regisPlace: regisPlace,
        car: car,
        regisDate: regisDate,
        expiredDate: expiredDate
    });
}

async function connect_CarCarOwners(carNum) {
    var carID = await Cars.find({});
    var carOwnerID = await CarOwners.find({});
    for (let i = 0; i < carNum; i++) {
        Cars.updateOne({
            _id: carID[i]
        }, {
            owner: carOwnerID[i]
        }).then(() => {
            // console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });

        CarOwners.updateOne({
            _id: carOwnerID[i]
        }, {
            ownedCar: carID[i]
        }).then(() => {
            // console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
    }
}

async function connect_RegistryCarStaff(carNum) {
    var carID = await Cars.find({});
    var registryID = await Registry.find({});
    var staffID = await Staff.find({
        isAdmin: 0
    });
    for (let i = 0; i < carNum; i++) {
        Registry.updateOne({
            _id: registryID[i]
        }, {
            regisPlace: staffID[getRandomNumber(0, staffID.length - 1)],
            car: carID[i]
        }).then(() => {
            // console.log("Successfully updated");
        }).catch((err) => {
            console.log(err);
            return;
        });
    }
}

async function connect_RegistryofficeStaff(maxStaffInOneOffice, isAdmin) {
    var registryOfficeID = await RegistryOffice.find({
        isAdmin: isAdmin
    });

    var staffID = await Staff.find({
        isAdmin: isAdmin
    });
    var j = 0;
    for (let i = 0; i < registryOfficeID.length; i++) {
        var count = 0;
        for (; j < staffID.length && count < maxStaffInOneOffice; j++) {
            count++;
            RegistryOffice.updateOne({
                _id: registryOfficeID[i]
            }, {
                $push: {
                    staff: staffID[j]
                }
            }).then(() => {
                // console.log("Successfully updated");
            }).catch((err) => {
                console.log(err);
                return;
            });

            Staff.updateOne({
                _id: staffID[j]
            }, {
                workFor: registryOfficeID[i]
            }).then(() => {
                // console.log("Successfully updated");
            }).catch((err) => {
                console.log(err);
                return;
            });
        }
    }
}

async function createAll(adminNum, staffNum, registryDepartmentNum, registryOfficeNum, carOwnerNum, carNum, registryNum) {
    for (let i = 0; i < adminNum; i++) {
        createStaff(i, 1);
    }
    for (let i = 0; i < staffNum; i++) {
        createStaff(i, 0);
    }
    createRegistryOffice(1, registryDepartmentNum);
    createRegistryOffice(0, registryOfficeNum);

    for (let i = 1; i <= carOwnerNum; i++) {
        createCarOwners(i);
    }

    const set = new Set();
    for (let i = 0; i < carNum; i++) {
        var numberPlate = getRandomNumberPlate();
        if (set.has(numberPlate)) {
            i--;
            continue;
        }
        set.add(numberPlate);
    }
    const arr = Array.from(set);
    for (let i = 0; i < arr.length; i++) {
        createCars(arr[i], i + 1);
    }

    for (let i = 0; i < registryNum; i++) {
        createRegistry();
    }
}

async function main() {
    // const db = mongoose.connection;
    // db.dropDatabase();
    // await createCollection();
    // await CarOwners.deleteMany({});
    // await Cars.deleteMany({});
    // await Person.deleteMany({});
    // await Registry.deleteMany({});
    // await RegistryOffice.deleteMany({});
    // await Staff.deleteMany({});

    // var adminNum = 50;
    // var staffNum = 1050;
    // var registryDepartmentNum = 1;
    // var registryOfficeNum = 150;
    // var carOwnerNum = 3000;
    // var carNum = carOwnerNum;
    // var registryNum = carNum;

    // createAll(adminNum, staffNum, registryDepartmentNum, registryOfficeNum, carOwnerNum, carNum, registryNum);
    // connect_CarCarOwners(carNum);
    // connect_RegistryCarStaff(carNum);
    // connect_RegistryofficeStaff(adminNum, 1);
    // connect_RegistryofficeStaff(7, 0);



    // const SALT_WORK_FACTOR = 10;
    // const bcrypt = require('bcrypt');
    // async function hashPassword(password) {
    //     const salt = await new Promise((resolve, reject) => {
    //         bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    //             if (err) reject(err)
    //             resolve(salt)
    //         });
    //     });
    //     const hashedPassword = await new Promise((resolve, reject) => {
    //         bcrypt.hash(password, salt, function (err, hash) {
    //             if (err) reject(err)
    //             resolve(hash)
    //         });
    //     });
    //     return hashedPassword;
    // }
    // var staff = await Staff.find({});
    // for (var i = 0; i < staff.length; i++) {
    //     var s = await hashPassword('12345678');
    //     Staff.updateOne({
    //         _id: staff[i]._id
    //     }, {
    //         password: String(s)
    //     }).then(() => {
    //         console.log(`Successfully updated ${i}`);
    //     }).catch((err) => {
    //         console.log(err);
    //         return;
    //     });
    // }
}
main();