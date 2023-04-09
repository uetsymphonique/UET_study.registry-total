const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
    ssn: {
        type: Number,
        required: [true, 'A person must have SSN']
    },
    firstName: {
        type: String,
        required: [true, 'A person must have first name']
    },
    lastName: {
        type: String,
        required: [true, 'A person must have last name']
    },
    address: {
        type: String,
        required: [true, 'A person must have address']
    },
    phone: {
        type: Number,
        required: [true, 'A person must have phone number'],
        validate: {
            validator: function (value) {
                // Phone number has 10 digits
                return (/^[0-9]{10}$/.test(value));
            },
            message: props => `${props.value} is not a valid phone number`
        },
        unique: true
    },
    email: {
        type: String,
        required: [true, 'A person must have email'],
        validate: {
            validator: function (value) {
                // Email
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
            },
            message: props => `${props.value} is not a valid email address`
        },
        unique: true
    }
});
module.exports = {PersonSchema};