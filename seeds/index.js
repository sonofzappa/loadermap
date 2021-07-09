const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Loader = require('../models/Loader');
const { captureRejectionSymbol } = require('events');

mongoose.connect('mongodb://localhost:27017/loader-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Loader.deleteMany({});
    for (let i = 0; i < 15; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const surcharge = Math.random() * 5;
        const loader = new Loader({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            company: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/8226838',
            description:  'When the drinks flow, this place rocks.',
            surcharge
        })
        await loader.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});