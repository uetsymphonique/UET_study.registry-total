const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const RegistrationCentre = require('./registrationCentreModel')
const vietnameseString = require('./../utils/vienameseString');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    ssn: {
        type: String,
        trim: true,
        required: [true, 'Người dùng cần có mã CCCD'],
        validate: {
            validator: function (value) {
                // Phone number has 10 digits
                return (/^[0-9]{12}$/.test(value));
            },
            message: props => `${props.value} không phải mã CCCD hợp lệ`
        },
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Người dùng cần có ngày sinh']
    },
    name: {
        type: String,
        trim: true,
        maxLength: 60,
        validate: {
            validator: function (value) {
                return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải tên hợp lệ`
        },
        required: [true, 'Người dùng cần có tên']
    },
    phone: {
        type: String,
        trim: true,
        required: [true, 'Người dùng cần có số điện thoại'],
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
        trim: true,
        required: [true, 'Người dùng cần có email'],
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} không phải địa chỉ email hợp lệ`
        },
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Bạn cần nhập mật khẩu'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, 'Bạn cần xác nhận mật khẩu'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    workFor: {
        type: Schema.Types.ObjectId,
        ref: 'RegistrationCentre',
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ['staff', 'admin'],
            message: props => `${props.value} không phải vai trò hợp lệ`
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

UserSchema.virtual('inspections', {
    ref: 'Inspection',
    foreignField: 'madeBy',
    localField: '_id'
});

UserSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    //hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1500;
    next();
});
UserSchema.pre('save', async function (next)  {
    const centre = await RegistrationCentre.findById(this.workFor);
    if (!centre) next();
    this.role = (centre.role === 'registry-total') ? 'admin' : 'staff';
    next();
})
UserSchema.pre(/^find/, function (next) {
    this.find({active: {$ne: false}})
        .select('-__v');
    next();
});
UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        //console.log(this.passwordChangedAt);
        //console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}
UserSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(4)
        .toString('hex');
    // const resetToken = randomFunction.getRandomNumber(0,999999).toString().padStart(6, '0');

    this.passwordResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    //console.log({resetToken}, this.passwordResetToken);
    return resetToken;
}
const User = mongoose.model('User', UserSchema);
module.exports = User;