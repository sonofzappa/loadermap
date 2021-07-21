const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

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
    phone: String,
    email: String,
    location: String,
    notes: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
}, opts);

LoaderSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/loaders/${this._id}">${this.company}</a><strong>
    <p>${this.phone}...</p>`
});

module.exports = mongoose.model('Loader', LoaderSchema);