const mongoose = require('mongoose');
const Person = require("./Person");
const Schema = mongoose.Schema;

const StaffSchema = new Schema({
    person: {
        type: Person.PersonSchema,
        required: [true, 'Staff must be a person']
    },
    loginEmail: {
        type: String,
        required: [true, 'Staff must have a login email'],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    work: {
        type: Schema.Types.ObjectId,
        ref: 'RegistrationCentre',
        required: true
    },
    account_status: {
        type: String,
        required: true,
        enum: ['active', 'inactive']
    }
});
const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;