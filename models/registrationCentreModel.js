const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const provinces = require('../utils/provinces')
const slugify = require('slugify');
const validator = require('validator');
const vietnameseString = require('../utils/vienameseString');
const RegistrationCentreSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Trung tâm yêu cầu có tên'],
        unique: true,
        trim: true,
        maxLength: 100,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải tên trung tâm hợp lệ`
        }
    },
    address: {
        type: String,
        enum: {
            values: provinces.getProvinceNames(),
            message: props => `${props.value} không phải địa chỉ hợp lệ`
        },
        required: true
    },
    side: {
        type: String,
        enum: {
            values: provinces.getSides(),
            message: props => `${props.value} không phải miền hợp lệ`
        },
    },
    area: {
        type: String,
        enum: {
            values: provinces.getAreas(),
            message: props => `${props.value} không phải vùng hợp lệ`
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
            message: props => `${props.value} không phải số điện thoại hợp lệ`
        },
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} không phải địa chỉ email hợp lệ`
        },
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    role: {
        type: String,
        enum: {
            values: ['registry-total', 'registry-branch'],
            message: props => `${props.value} không phải vai trò hợp lệ`
        },
        default: 'registry-branch',
        select: false
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
// RegistrationCentreSchema.virtual('inspections', {
//     ref: 'Inspection',
//     foreignField: 'centre',
//     localField: '_id',
// });
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
RegistrationCentreSchema.pre(/^find/, function (next) {
    this.find({
        active: {$ne: false}
    }).select('-__v');
    next();
});

const RegistrationCentre = mongoose.model('RegistrationCentre', RegistrationCentreSchema);
module.exports = RegistrationCentre;