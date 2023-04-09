const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Person = require('./Person');

const AdminSchema = new Schema({
    person: {
        type: Person.PersonSchema,
        required: true,
    },
    login_email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;