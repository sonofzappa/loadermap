const mongoose = require('mongoose');
const { Schema } = mongoose;

const LoaderSchema = new Schema({
    company: String,
    contact: String,
    phone: Number,
    email: String,
    city: String,
    state: String,
    zip: Number,
    notes: String,
    location: {
        formattedAddress: String,
        latitude: Number,
        longitude: Number,
        countryCode: String,
        city: String,
        stateCode: String,
        zipcode: Number,
    }
});

module.exports = mongoose.model('Loader', LoaderSchema);