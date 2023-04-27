const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RegistrationCertification = new Schema({
    registration_number: {
        type: String,
        required: true,
        unique: true
    },
    registration_date: {
        type: Date,
        required: true
    }
});
const Specification = new Schema({
    wheel_formula: String,
    wheel_tread: String,
    overall_dimension: String,
    container_dimension: String,
    length_base: String,
    kerb_mass: String,
    authorized_payload: String,
    authorized_total_mass: String,
    authorized_towed_mass: String,
    permissible_carry: String,
    fuel: String,
    engine_displacement: String,
    maximum_output_to_rpm_ratio: String,
    number_of_tires_and_tire_size: String
})
const CarSchema = new Schema({
    number_plate: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner'
    },
    type: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    model_code: {
        type: String,
        required: true
    },
    engine_number: {
        type: String,
        required: true
    },
    chassis_number: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    manufactured_year: {
        type: String,
        required: true
    },
    manufactured_country: {
        type: String,
        required: true
    },
    bought_place: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        required: true,
        enum: {
            values: ['personal', 'business'],
            message: 'Only personal or business purpose'
        }
    },
    specification: {
        type: Specification,
        required: true
    },
    registration_certificate:{
        type: RegistrationCertification,
        required: true
    }
});

const Car = mongoose.model('Car', CarSchema);
module.exports = Car;