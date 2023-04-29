const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        required: true
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
    }
});
// InspectionSchema.pre('save', async function(next){
//     this.inspection_number = await Inspection.countDocuments({
//         inspection_number: {
//             $regex: `/^${this.inspected_date.getFullYear()}`, $options: 'i'
//         }
//     });
// });

InspectionSchema.pre('save', function (next){
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
        this.expired_date = addMonths(this.inspected_date, expiredTime);
    }
    next();
});
const Inspection = mongoose.model('Inspection', InspectionSchema);
module.exports = Inspection;