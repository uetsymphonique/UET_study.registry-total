const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./carModel');
const User = require('./userModel');


const InspectionSchema = new Schema({
    inspectionNumber: {
        type: String,
        // required: true,
        // unique: true,
        trim: true
    },
    expiredDate: {
        type: Date,
    },
    inspectionDate: {
        type: Date,
        default: Date.now()
    },
    firstTime: {
        type: Boolean,
    },
    specify: {
        type: String,
        // required: true,
        enum: {
            values: ['carry_people$lte:9-personal+manufacture$lte:7~36~24',
                'carry_people$lte:9-personal+manufacture$gt:7and$lte:20~12~12',
                'carry_people$lte:9-personal+manufacture$gt:20~6~6',
                //
                'carry_people$lte:9-business+manufacture$lte:5~24~12',
                'carry_people$lte:9-business+manufacture$gt:5~6~6',
                'carry_people$lte:9-business+recovered~12~6',
                //
                'carry_people$gt:9+manufacture$lte:5~24~12',
                'carry_people$gt:9+manufacture$gt:5and$lte:14~6~6',
                'carry_people$gt:9+recovered~12~6',
                //
                'truck_specializedCar+manufacture$lte:7~24~12',
                'truck_specializedCar+manufacture$gt:7and$lte:19~6~6',
                'truck_specializedCar+recovered~12~6',
                //
                'carry_people$gt:9+manufacture$gt:14~3~3',
                'truck_specializedCar+manufacture$gt:19~3~3'
            ],
            message: '{VALUE} has not been appeared in the database'
        }
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    madeBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    centre: {
        type: Schema.Types.ObjectId,
        ref: 'RegistrationCentre',
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

/**
 * indicate the centre make inspection
 */
InspectionSchema.pre('save', async function (next) {
    const user = await User.findById(this.madeBy);
    this.centre = user.workFor;
    next();
})

/**
 * indicate the inspection number in sequence
 */
InspectionSchema.pre('save', async function (next) {
    const index = await Inspection.countDocuments({
        inspectionNumber: new RegExp(`^${this.inspectionDate.getFullYear()}`)
    });
    this.inspectionNumber = `${this.inspectionDate.getFullYear()}-${index.toString()
        .padStart(6, '0')}`
    next();
});

/**
 * indicate this is the first time or not and the expired date of the inspection
 */
InspectionSchema.pre('save', async function (next) {
    const car = await Car.findById(this.car);
    this.specify = car.getSpecify(this.inspectionDate.getFullYear());
    this.firstTime = !(car.inspected);
    const str = this.specify.split('~');
    const expiredTime = this.firstTime ? parseInt(str[1]) : parseInt(str[2]);
    const addMonths = (date, months) => {
        const newDate = new Date(date);
        const currMonth = newDate.getMonth();

        newDate.setMonth(currMonth + months);

        // handle edge case where adding months crosses a year boundary
        if (newDate.getMonth() !== (currMonth + months) % 12) {
            newDate.setDate(0); // set to last day of previous month
        }

        return newDate;
    }
    if (expiredTime) {
        this.expiredDate = addMonths(this.inspectionDate, expiredTime);
    }
    car.inspected = true;
    await car.save({
        validateBeforeSave: false,
    });
    next();
});
InspectionSchema.pre(/^find/, function (next) {
    this.select('-__v -id');
    next();
});
InspectionSchema.pre('find', function (next) {
    this.populate({
        path: 'car',
        select: 'numberPlate'
    });
    next();
})

const Inspection = mongoose.model('Inspection', InspectionSchema);
module.exports = Inspection;