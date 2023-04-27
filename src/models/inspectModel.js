const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InspectSchema = new Schema({
    staff:{
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    car:{
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    inspection: {
        type: Schema.Types.ObjectId,
        ref: 'Inspection',
        required: true
    }
});
const Inspect = mongoose.model('Inspect', InspectSchema);
module.exports = Inspect;