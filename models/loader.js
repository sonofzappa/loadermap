const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoaderSchema = new Schema({
    company: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contact: String,
    phone: Number,
    email: String,
    location: String,
    notes: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
});

module.exports = mongoose.model('Loader', LoaderSchema);