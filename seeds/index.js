if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
  }

const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Loader = require('../models/loader');
const { captureRejectionSymbol } = require('events');
const faker = require('faker');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
})


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Loader.deleteMany({});
    for (let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        let randomCompany = faker.company.companyName();
        let randomName = faker.name.findName(); 
        let randomEmail = faker.internet.email();
        let randomPhone = faker.phone.phoneNumber();
        const loader = new Loader({
            author: '60f1910046574634b8d47e9d',
            contact: randomName,
            company: randomCompany,
            email: randomEmail,
            phone: randomPhone,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
        })
        await loader.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});