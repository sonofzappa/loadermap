const Loader = require('../models/loader');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const loaders = await Loader.find({});
    res.render('loaders/index', { loaders })
}

module.exports.renderNewForm = (req, res) => {
    res.render('loaders/new');
}
module.exports.show = async (req, res) => {
    const loader = await Loader.findById(req.params.id);
    if(!loader){
        req.flash('error', 'That loader cannot be found!')
        return res.redirect('/loaders');
    }
    res.render('loaders/show', { loader });
};

module.exports.createLoader = async (req, res) => {  
    const geoData = await geocoder.forwardGeocode({
        query: req.body.loader.location,
        limit: 1
    }).send() 
    const loader = new Loader(req.body.loader);
    loader.geometry = geoData.body.features[0].geometry;
    loader.author = req.user._id;
    await loader.save();
    console.log(loader);
    req.flash('success', 'Successfully added new loader');
    res.redirect(`/loaders/${loader._id}`)
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findById(id)
    if (!loader) {
        req.flash('error', 'Cannot find that loader!');
        return res.redirect('/loaders');
    }
    res.render('loaders/edit', { loader });
}

module.exports.updateLoader = async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findByIdAndUpdate(id, { ...req.body.loader });
    req.flash('success', 'Successfully updated loader!');
    res.redirect(`/loaders/${loader._id}`)
};


module.exports.deleteLoader = async (req, res) => {
    const { id } = req.params;
    await Loader.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted new loader!');
    res.redirect('/loaders');
}