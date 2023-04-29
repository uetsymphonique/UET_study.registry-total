const randomFunction = require('./randomFunction');
const Car = require('../models/carModel');

const createRegistrationCertificate = async (year) => {
    const date = new Date(randomFunction.createDate(`${year+1}-01-01`, "2022-12-31"));
    const index = await Car.countDocuments({'registration_certificate.registration_number': {$regex: `/^${date.getFullYear()}/`, $options: 'i'}});
    return {
        registration_number: `${date.getFullYear()}${index.toString().padStart(6,'0')}`,
        registration_date: date
    }
}

module.exports = createRegistrationCertificate;