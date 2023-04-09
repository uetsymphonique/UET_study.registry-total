const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
    classification: {
        type: String,
        enum: ['individual','organization']
    }
});
const Owners = mongoose.model('Owner', OwnerSchema);
module.exports = Owners;