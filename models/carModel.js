const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const CarSchema = new Schema({
    numberPlate: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return (/^\d{2}[a-zA-Z]\d-\d{3}\.\d{2}$/.test(value));
            },
            message: props => `${props.value} is not a valid number plate`
        }
    },
    owner: {
        name: {
            type: String,
            required: [true, 'A owner must have name'],
            trim: true,
            maxLength: 60
        },
        address: {
            type: String,
            required: [true, 'A owner must have address'],
            trim: true,
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
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, 'A owner must have email'],
            validate: {
                validator: validator.isEmail,
                message: props => `${props.value} is not a valid email address`
            },
            unique: true,
            trim: true
        },
        role:{
            type: String,
            enum: ['individual', 'organization'],
            default: 'individual'
        }
    },
    registrationNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    registrationDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        trim: true,
        //required: true
    },
    brand: {
        type: String,
        trim: true,
        //required: true
    },
    modelCode: {
        type: String,
        trim: true,
        //required: true
    },
    engineNumber: {
        type: String,
        trim: true,
        //required: true
    },
    chassisNumber: {
        type: String,
        trim: true,
        //required: true
    },
    color: {
        type: String,
        trim: true,
        //required: true
    },
    manufacturedYear: {
        type: String,
        trim: true
        //required: true
    },
    manufacturedCountry: {
        type: String,
        trim: true
        //required: true
    },
    boughtPlace: {
        type: String,
        trim: true
        //required: true
    },
    purpose: {
        type: String,
        //required: true,
        enum: {
            values: ['personal', 'business'],
            message: 'Only personal or business purpose'
        }
    },
    specification: {
        wheelFormula: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+x\d+$/.test(value));
                },
                message: props => `${props.value} is not a valid wheel formula`
            }
        },
        wheelTread: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid wheel tread`
            }
        },
        overallDimension: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*x\s*\d+\s*x\s*\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid overall dimension`
            }
        },
        containerDimension: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*x\s*\d+\s*x\s*\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid container dimension`
            }
        },
        lengthBase: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid length base`
            }
        },
        kerbMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid kerb mass`
            }
        },
        designedAndAuthorizedPayload: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid designed/authorized payload`
            }
        },
        designedAndAuthorizedTotalMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid designed/authorized total mass`
            }
        },
        designedAndAuthorizedTowedMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid designed/authorized towed mass`
            }
        },
        permissibleCarry: {
            type: Number,
        },
        fuel: {
            type: String,
            trim: true,
        },
        engineDisplacement: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*cm3\s*\)$/.test(value));
                },
                message: props => `${props.value} is not a valid engine displacement`
            }
        },
        maximumOutputToRpmRatio: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+kW\/\d+vph$/.test(value));
                },
                message: props => `${props.value} is not a valid output to rpm ratio`
            }
        },
        numberOfTiresAndTireSize: {
            type: String,
            trim: true,
        }
    },
    recovered: {
        type: Boolean,
        default: false
    },
    bookedInspection_date: {
        type: Date,
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

CarSchema.virtual('inspections', {
    ref: 'Inspection',
    foreignField: 'car',
    localField: '_id'
});


CarSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});

CarSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'owner'
    })
    next();
});

CarSchema.methods.getSpecify = function () {
    let speType;
    if (this.type === 'Minivan' || this.type === 'Pickup truck' || this.type === 'Van') {
        speType = 'truck_specializedCar'
    } else {
        speType = 'carry_people';
    }
    let speCarry = '';
    if (speType === 'carry_people') {
        speCarry = (this.permissibleCarry > 9) ? '$gt:9' : '$lte:9';
    }
    let spePurpose = '';
    if (speCarry === '$lte:9') {
        spePurpose = `-${this.purpose}`;
        // console.log(spePurpose);
    }
    let speManufactureAndTimePeriod = '';
    if (speType === 'carry_people') {
        if (speCarry === '$lte:9') {
            if (spePurpose === '-personal') {
                if (this.manufacturedYear <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~36~24';
                else if (this.manufacturedYear <= 20) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:20~12~12';
                else speManufactureAndTimePeriod = '+manufacture$gt:20~6~6';
            } else {
                if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
                else if (this.manufacturedYear <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12'
                else speManufactureAndTimePeriod = '+manufacture$gt:5~6~6';
            }
        } else {
            if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
            else if (this.manufacturedYear <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12';
            else if (this.manufacturedYear <= 14) speManufactureAndTimePeriod = '+manufacture$gt:5and$lte:14~6~6';
            else speManufactureAndTimePeriod = '+manufacture$gt:14~3~3';
        }
    } else {
        if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
        else if (this.manufacturedYear <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~24~12';
        else if (this.manufacturedYear <= 19) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:19~6~6';
        else speManufactureAndTimePeriod = '+manufacture$gt:19~3~3';
    }
    return `${speType}${speCarry}${spePurpose}${speManufactureAndTimePeriod}`;
}

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;