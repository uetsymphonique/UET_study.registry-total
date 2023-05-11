const randomFunction = require('./randomFunction');

const types = ['Sedan', 'Hatchback', 'Coupe', 'SUV', 'Minivan', 'Bus', 'Pickup truck', 'Sports car', 'Electric car','Luxury car', 'Van'];
const getPermissibleCarryForCarType = (carType) => {
    switch(carType) {
        case 'Sedan':
        case 'Hatchback':
        case 'Electric car':
        case 'Luxury car':
            return 5;
        case 'Coupe':
        case 'Sports car':
            return 4;
        case 'SUV':
            return 7;
        case 'Minivan':
        case 'Van':
            return 8;
        case 'Pickup truck':
            return 6;
        case 'Bus':
            return 60;
        default:
            return 'Unknown car type';
    }
}
const generateSpecificationForCarType = (carType) => {
    const wheelFormulas = ['4x2', '4x4', '6x4', '6x6', '8x8'];
    const fuels = ['Gasoline', 'Diesel', 'Electric'];
    const numberOfTires = [4, 6, 8];
    const tireSizes = ["205/55 R16", "225/65 R17", "235/45 R18", "265/70 R16", "215/60 R16", "225/40 R18"];
    return {
        wheelFormula: wheelFormulas[randomFunction.getRandomNumber(0,3)],
        wheelTread: `${randomFunction.getRandomNumber(1400, 2000)} (mm)`,
        overallDimension: `${randomFunction.getRandomNumber(3500, 5000)} x ${randomFunction.getRandomNumber(1500, 2200)} x ${randomFunction.getRandomNumber(1200, 1800)} (mm)`,
        containerDimension: `${randomFunction.getRandomNumber(1500, 2500)} x ${randomFunction.getRandomNumber(1000, 1500)} x ${randomFunction.getRandomNumber(800, 1200)} (mm)`,
        lengthBase: `${randomFunction.getRandomNumber(2400, 3200)} (mm)`,
        kerbMass:`${randomFunction.getRandomNumber(800, 1600)} (kg)`,
        designedAndAuthorizedPayload: `${randomFunction.getRandomNumber(500, 1000)}/${randomFunction.getRandomNumber(500, 1000)} (kg)`,
        designedAndAuthorizedTotalMass: `${randomFunction.getRandomNumber(1500, 3000)}/${randomFunction.getRandomNumber(1500, 3000)} (kg)`,
        designedAndAuthorizedTowedMass: `${randomFunction.getRandomNumber(1000, 2000)}/${randomFunction.getRandomNumber(1000, 2000)} (kg)`,
        permissibleCarry: getPermissibleCarryForCarType(carType),
        fuel: fuels[randomFunction.getRandomNumber(0, fuels.length - 1)],
        engineDisplacement: `${randomFunction.getRandomNumber(1650, 4000)} (cm3)`,
        maximumOutputToRpmRatio: `${randomFunction.getRandomNumber(50, 150)}kW/${randomFunction.getRandomNumber(5000, 7000)}vph`,
        numberOfTiresAndTireSize: `${numberOfTires[randomFunction.getRandomNumber(0, 2)]} tires, ${tireSizes[randomFunction.getRandomNumber(0, tireSizes.length - 1)]}`,
    };
}
module.exports = generateSpecificationForCarType;