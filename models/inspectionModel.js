const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InspectionSchema = new Schema({
    expired_date: {
        type: Date
    },
    inspected_date: {
        type: Date
    }
});

const Inspection = mongoose.model('Inspection', InspectionSchema);
module.exports = Inspection;