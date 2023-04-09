const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationOwnerSchema =  new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: true
    },
    name: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    organization_type: {
        type: String
    }
});
const organizations = mongoose.model('organizations', OrganizationOwnerSchema);
module.exports = organizations;