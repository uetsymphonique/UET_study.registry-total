const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const provinces = require('../utils/provinces')
const slugify = require('slugify');
const validator = require('validator');
const vietnameseString = require('../utils/vienameseString');
const RegistrationCentreSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxLength: 100,
        // validate:{
        //     validator: vietnameseString.isAlphanumeric,
        //     message: props => `${props.value} is not a valid name of a registration centre`
        // }
    },
    address: {
        type: String,
        enum: {
            values: provinces.getProvinceNames(),
            message: props => `${props.value} is not a valid province`
        },
        required: true
    },
    side: {
        type: String,
        enum: {
            values: provinces.getSides(),
            message: props => `${props.value} is not a valid side`
        },
    },
    area: {
        type: String,
        enum: {
            values: provinces.getAreas(),
            message: props => `${props.value} is not a valid area`
        }
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: true,
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
        required: true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email address`
        },
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

RegistrationCentreSchema.virtual('employees', {
    ref: 'User',
    foreignField: 'workFor',
    localField: '_id',
});
RegistrationCentreSchema.virtual('inspections', {
    ref: 'Inspection',
    foreignField: 'centre',
    localField: '_id',
});
RegistrationCentreSchema.pre(/^find/, function (next) {
    this.select('-__v -id');
    next();
});
RegistrationCentreSchema.pre('save', function (next) {
    this.slug = slugify(vietnameseString.format(this.name), {lower: true});
    this.side = provinces.mappingProvinceToSide(this.address);
    this.area = provinces.mappingProvinceToArea(this.address);
    next();
});
const RegistrationCentre = mongoose.model('RegistrationCentre', RegistrationCentreSchema);
module.exports = RegistrationCentre;