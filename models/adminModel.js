const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    ssn: {
        type: Number,
        required: [true, 'A person must have SSN'],
        validate: {
            validator: function (value) {
                // Phone number has 10 digits
                return (/^[0-9]{10}$/.test(value));
            },
            message: props => `${props.value} is not a valid ssn`
        },
        unique: true
    },
    name: {
        type: String,
        required: [true, 'An admin must have name'],
        unique: true,
        trim: true,
        validate: [validator.isAlpha, 'Name must only contain alpha characters']
    },
    address: {
        type: String,
        required: [true, 'An admin must have address'],
        trim: true
    },
    phone: {
        type: Number,
        required: [true, 'An admin must have phone number'],
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
        required: [true, 'An admin must have email'],
        validate: {
            validator: function (value) {
                // Email
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
            },
            message: props => `${props.value} is not a valid email address`
        },
        unique: true
    },
    login_email: {
        type: String,
        required: [true, 'An admin must have login-email'],
        validate: {
            validator: function (value) {
                // Email
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
            },
            message: props => `${props.value} is not a valid login-email address`
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;