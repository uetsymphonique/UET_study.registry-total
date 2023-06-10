const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;
const provinces = require('./../utils/provinces');
const vietnameseString = require('./../utils/vienameseString');
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
            message: props => `${props.value} không phải biển số xe hợp lệ`
        }
    },
    owner: {
        name: {
            type: String,
            required: [true, 'Chủ sở hữu yêu cầu có tên'],
            trim: true,
            maxLength: 60,
            validate: {
                validator: function (value) {
                    return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
                },
                message: props => `${props.value} không phải tên hợp lệ`
            }
        },
        address: {
            type: String,
            required: [true, 'Chủ sở hữu yêu cầu có địa chỉ'],
            trim: true,
            maxLength: 150,
        },
        phone: {
            type: String,
            required: [true, 'Chủ sở hữu yêu cầu có số điện thoại'],
            validate: {
                validator: function (value) {
                    // Phone number has 10 digits
                    return (/^[0-9]{10}$/.test(value));
                },
                message: props => `${props.value} không phải số điện thoại hợp lệ`
            },
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Chủ sở hữu yêu cầu có email'],
            validate: {
                validator: validator.isEmail,
                message: props => `${props.value} không phải địa chỉ email hợp lệ`
            },
            unique: true,
            trim: true
        },
        role: {
            type: String,
            enum: ['individual', 'organization'],
            default: 'individual'
        }
    },
    registrationNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return (/^\d{4}-\d{6}$/.test(value));
            },
            message: props => `${props.value} không phải số đăng kí xe hợp lệ`
        }
    },
    registrationDate: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    brand: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    modelCode: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    engineNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    chassisNumber: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    color: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    manufacturedYear: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                // Phone number has 10 digits
                return (/^[0-9]{4}$/.test(value));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        },
    },
    manufacturedCountry: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    boughtPlace: {
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
            },
            message: props => `${props.value} không phải giá trị hợp lệ`
        }
    },
    purpose: {
        type: String,
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
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        wheelTread: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        overallDimension: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*x\s*\d+\s*x\s*\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        containerDimension: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*x\s*\d+\s*x\s*\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        lengthBase: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*mm\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        kerbMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        designedAndAuthorizedPayload: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        designedAndAuthorizedTotalMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        designedAndAuthorizedTowedMass: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\/\d+\s*\(\s*kg\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        permissibleCarry: {
            type: Number,
        },
        fuel: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return validator.isAlpha(vietnameseString.format(value).split(' ').join(''));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        engineDisplacement: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+\s*\(\s*cm3\s*\)$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
            }
        },
        maximumOutputToRpmRatio: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    return (/^\d+kW\/\d+vph$/.test(value));
                },
                message: props => `${props.value} không phải giá trị hợp lệ`
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
    inspected: {
        type: Boolean,
        default: false
    },
    predictedAddress: String,
    predictedArea: String,
    predictedSide: String,
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

CarSchema.virtual('inspections', {
    ref: 'Inspection',
    foreignField: 'car',
    localField: '_id'
});
CarSchema.pre('save', function (next) {
    this.predictedAddress = this.owner.address.split(', ')[2];
    this.predictedSide = provinces.mappingProvinceToSide(this.predictedAddress);
    this.predictedArea = provinces.mappingProvinceToArea(this.predictedAddress);
    next();
});


CarSchema.pre(/^find/, function (next) {
    this.select('-__v');
    next();
});


CarSchema.methods.getSpecify = function (year) {
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
                if (year - this.manufacturedYear <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~36~24';
                else if (year - this.manufacturedYear <= 20) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:20~12~12';
                else speManufactureAndTimePeriod = '+manufacture$gt:20~6~6';
            } else {
                if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
                else if (year - this.manufacturedYear <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12';
                else speManufactureAndTimePeriod = '+manufacture$gt:5~6~6';
            }
        } else {
            if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
            else if (year - this.manufacturedYear <= 5) speManufactureAndTimePeriod = '+manufacture$lte:5~24~12';
            else if (year - this.manufacturedYear <= 14) speManufactureAndTimePeriod = '+manufacture$gt:5and$lte:14~6~6';
            else speManufactureAndTimePeriod = '+manufacture$gt:14~3~3';
        }
    } else {
        if (this.recovered) speManufactureAndTimePeriod = '+recovered~12~6';
        else if (year - this.manufacturedYear <= 7) speManufactureAndTimePeriod = '+manufacture$lte:7~24~12';
        else if (year - this.manufacturedYear <= 19) speManufactureAndTimePeriod = '+manufacture$gt:7and$lte:19~6~6';
        else speManufactureAndTimePeriod = '+manufacture$gt:19~3~3';
    }
    return `${speType}${speCarry}${spePurpose}${speManufactureAndTimePeriod}`;
}

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;