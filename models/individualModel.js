const mongoose = require('mongoose');
const Person = require("./Person");
const Schema = mongoose.Schema;

const IndividualOwnerSchema = new Schema({
    person: {
        type: Person.PersonSchema,
        required: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    }
});
const Individual = mongoose.model('Individual', IndividualOwnerSchema);
module.exports = Individual;