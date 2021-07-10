const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Loader = require('../models/loader');
// GeoCoder //
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'qXsAzfEZ95I9ATFAwGosrUZEFk7CMerF',
    formatter: null
};
const geocoder = NodeGeocoder(options);


// INDEX //
router.get('/', catchAsync(async (req, res) => {
    const loaders = await Loader.find({});
    res.render('loaders/index', { loaders })
}))

// NEW ROUTE //
router.get('/new', (req, res) => {
    res.render('loaders/new')
});

// SHOW ROUTE //
router.get('/:id', catchAsync(async (req, res) => {
    const loader = await Loader.findById(req.params.id);
    console.log(loader)
    res.render('loaders/show', { loader });
}));

// CREATE ROUTE //
router.post('/', catchAsync(async (req, res) => {

    // const loaderSchema = Joi.object({
    //     loader: Joi.object({
    //         company: Joi.string().required(),
    //     //     contact: Joi.string().required(),
    //     //     phone: Joi.number().required().min(7),
    //     //     company: Joi.string().required(),
    //     //     email: Joi.string()
    //     // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    //     }).required()
    // })
    // const joiResult = loader.Schema.validate(req.body);
    // console.log(joiResult)
    // Using callback
    let location = req.body.loader.city + " " + req.body.loader.state;
    if (req.body.loader.zip) {
        location = location + " " + req.body.loader.zip;
    }
    const result = await geocoder.geocode(location);
    if (result && result.length) {
        req.body.loader.location = result[0];
    }

    const loader = new Loader(req.body.loader);
    await loader.save();
    res.redirect('/loaders')
}));

// EDIT ROUTE //
router.get('/:id/edit', catchAsync(async (req, res) => {
    const loader = await Loader.findById(req.params.id)
    res.render('loaders/edit', { loader });
}))

// UPDATE ROUTE //
router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findByIdAndUpdate(id, { ...req.body.loader });
    res.redirect(`/loaders/${loader._id}`)
}))

// REMOVE ROUTE //

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Loader.findByIdAndDelete(id);
    res.redirect('/loaders');
}))

module.exports = router;