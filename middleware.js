const { loaderSchema } = require('./schema');

const ExpressError = require('./utils/ExpressError');
const Loader = require('./models/loader');

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateLoader = (req, res, next) => {
    const { error } = loaderSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const loader = await Loader.findById(id);
    if (!loader.author.equals(req.user._id)) {
        req.flash('error', 'That loader cannot be found (or edited)!')
        return res.redirect('/loaders');
    }
    next();
}