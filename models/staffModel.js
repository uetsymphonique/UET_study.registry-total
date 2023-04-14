const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    ssn: {
        type: Number,
        required: [true, 'A person must have SSN']
    },
    name: {
        type: String,
        required: [true, 'A staff must have name']
    },
    address: {
        type: String,
        required: [true, 'A staff must have address']
    },
    phone: {
        type: Number,
        required: [true, 'A staff must have phone number'],
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
        required: [true, 'A staff must have email'],
        validate: {
            validator: function (value) {
                // Email
                return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
            },
            message: props => `${props.value} is not a valid email address`
        },
        unique: true
    },
    loginEmail: {
        type: String,
        required: [true, 'Staff must have a login email'],
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
    },
    work: {
        type: Schema.Types.ObjectId,
        ref: 'RegistrationCentre',
        required: true
    },
    account_status: {
        type: String,
        required: true,
        enum: ['active', 'inactive']
    }
});
const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;