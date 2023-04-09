const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegistrationCentreSchema =  new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
const RegistrationCentre = mongoose.model('RegistrationCentre', RegistrationCentreSchema);
module.exports = RegistrationCentre;