const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Loader = require('../models/loader');
const { isLoggedIn } = require('../middleware')
// GeoCoder //
const NodeGeocoder = require('node-geocoder');


const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: 'qXsAzfEZ95I9ATFAwGosrUZEFk7CMerF',
    formatter: null
};
const geocoder = NodeGeocoder(options);

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const loader = await Loader.findById(id);
    if (!loader.author.equals(req.user._id)) {
        req.flash('error', 'That loader cannot be found (or edited)!')
        return res.redirect('/loaders');
    }
    next();
}

// INDEX //
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const loaders = await Loader.find({});
    res.render('loaders/index', { loaders })
}))

// NEW ROUTE //
router.get('/new', isLoggedIn, (req, res) => {
    res.render('loaders/new');
})

// SHOW ROUTE //
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const loader = await Loader.findById(req.params.id);
    if(!loader){
        req.flash('error', 'That loader cannot be found!')
        return res.redirect('/loaders');
    }
    res.render('loaders/show', { loader });
}));

// CREATE ROUTE //
router.post('/', isLoggedIn, catchAsync(async (req, res) => {

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
    loader.author = req.user._id;

    await loader.save();
    console.log(loader.location);
    console.log(loader.author.id);
    req.flash('success', 'Successfully added new loader');
    res.redirect(`/loaders/${loader._id}`)
}));

// EDIT ROUTE //
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findById(id)
    if(!loader.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/loaders/${id}`);
    }
    res.render('loaders/edit', { loader });
}))

// UPDATE ROUTE //
router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findById(id)
    if(!loader.author.equals(req.user._id)){
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/loaders/${id}`);
    }
    const load = await Loader.findByIdAndUpdate(id, { ...req.body.loader });
    req.flash('success', 'Successfully updated loader!');

    res.redirect(`/loaders/${loader._id}`)
}))

// REMOVE ROUTE //

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Loader.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted new loader!');

    res.redirect('/loaders');
}))

module.exports = router;