const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A owner must have name']
    },
    address: {
        type: String,
        required: [true, 'A owner must have address'],
    },
    phone: {
        type: String,
        required: [true, 'A owner must have phone number'],
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
        required: [true, 'A owner must have email'],
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email address`
        },
        unique: true
    },
    role:{
        type: String,
        enum: ['individual', 'organization'],
        default: 'individual'
    }
});
const Owner = mongoose.model('Owner', OwnerSchema);
module.exports = Owner;