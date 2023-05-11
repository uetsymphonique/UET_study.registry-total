const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Car = require('./carModel');
const Owner = require('./ownerModel')

const InspectionSchema = new Schema({
    inspection_number: {
        type: String,
        //required: true,
        //unique: true
    },
    expired_date: {
        type: Date,
    },
    inspected_date: {
        type: Date,
        // required: true,
        default: Date.now()
    },
    firstTime: {
        type: Boolean,
        default: true
    },
    specify: {
        type: String,
        required: true,
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
    registration_centre: {
        type: Schema.Types.ObjectId,
        ref: 'RegistrationCentre',
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});



/**
 * indicate the inspection number in sequence
 */
// InspectionSchema.pre('save', async function (next) {
//     this.inspection_number = await Inspection.countDocuments({
//         inspection_number: {
//             $regex: `/^${this.inspected_date.getFullYear()}`,
//             $options: 'i'
//         }
//     });
// });
/**
 * indicate the specification of the inspection
 */
// InspectionSchema.pre('save', async function (next) {
//     this.specify = getSpecify(await Car.find({_id: this.car}));
// });
const getSpecify = (car) => {
    let speType;
    if (car.type === 'Minivan' || car.type === 'Pickup truck' || car.type === 'Van') {
        speType = 'truck_specializedCar'
    } else {
        speType = 'carry_people';
    }
    let speCarry = '';
    if (speType === 'carry_people') {
        speCarry = (car.specification.permissible_carry > 9) ? '$gt:9' : '$lte:9';
    }
    let spePurpose = '';
    if (speCarry === '$lte:9') {
        spePurpose = `-${car.purpose}`;
    }
    let speManufactureAndTimePeriod = '';
    if (speType === 'carry_people') {
        if (speCarry === '$lte:9') {
            if (spePurpose === '-personal') {
                if (car.manufactured_year <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~36~24';
                else if (car.manufactured_year <= 20) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:20~12~12';
                else speManufactureAndTimePeriod = '+manufacture$gt:20~6~6';
            } else {
                if (car.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
                else if (car.manufactured_year <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12'
                else speManufactureAndTimePeriod = '+manufacture$gt:5~6~6';
            }
        } else {
            if (car.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
            else if (car.manufactured_year <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12';
            else if (car.manufactured_year <= 14) speManufactureAndTimePeriod = '+manufacture$gt:5and$lte:14~6~6';
            else speManufactureAndTimePeriod = '+manufacture$gt:14~3~3';
        }
    } else {
        if (car.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
        else if (car.manufactured_year <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~24~12';
        else if (car.manufactured_year <= 19) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:19~6~6';
        else speManufactureAndTimePeriod = '+manufacture$gt:19~3~3';
    }
    return `${speType}${speCarry}${spePurpose}${speManufactureAndTimePeriod}`;
}
/**
 * indicate the expired date of the inspection
 */
// InspectionSchema.pre('save', function (next) {
//     const str = this.specify.split('~');
//     const expiredTime = this.firstTime ? parseInt(str[1]) : parseInt(str[2]);
//     const addMonths = (date, months) => {
//         const newDate = new Date(date);
//         const currMonth = newDate.getMonth();
//
//         newDate.setMonth(currMonth + months);
//
//         // handle edge case where adding months crosses a year boundary
//         if (newDate.getMonth() !== (currMonth + months) % 12) {
//             newDate.setDate(0); // set to last day of previous month
//         }
//
//         return newDate;
//     }
//     if (expiredTime) {
//         this.expired_date = addMonths(this.inspected_date, expiredTime);
//     }
//     next();
// });
// InspectionSchema.virtual('inspected_season')
//     .get(function () {
//         return Math.floor((this.inspected_date.getMonth() + 1) / 3) + 1;
//     })
InspectionSchema.pre(/^find/, function (next) {
    this.select('-__v -id');
    next();
});
// InspectionSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'madeBy',
//         select: '-__v'
//     })
//         .populate({
//             path: 'car',
//             select: 'registration_certificate number_plate owner',
//             populate: {
//                 path: 'owner'
//             }
//         })
//     next();
// });
// InspectionSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({})
//     next();
// })

const Inspection = mongoose.model('Inspection', InspectionSchema);
module.exports = Inspection;