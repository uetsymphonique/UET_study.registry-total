const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InspectionSchema = new Schema({
    inspection_number: {
        type: String,
        required: true
    },
    expired_date: {
        type: Date,
        required: true
    },
    inspected_date: {
        type: Date,
        required: true
    }
});

const Inspection = mongoose.model('Inspection', InspectionSchema);
module.exports = Inspection;