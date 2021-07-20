const Loader = require('../models/loader');
const Joi = require('joi');



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
    const loader = new Loader(req.body.loader);
    loader.author = req.user._id;
    await loader.save();
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
    const loader = await Loader.findById(id, { ...req.body.loader });
    req.flash('success', 'Successfully updated loader!');
    res.redirect(`/loaders/${loader._id}`)
};


module.exports.deleteLoader = async (req, res) => {
    const { id } = req.params;
    await Loader.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted new loader!');
    res.redirect('/loaders');
}