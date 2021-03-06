const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn, isAuthor, validateLoader } = require('../middleware')

router.get('/register', catchAsync(async(req, res) => {
    res.render('users/register')
}))

router.post('/register', catchAsync(async(req, res, next) => {
    try {
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
            req.flash('success', 'Welcome to The Loader App!');
            res.redirect('/loaders');
    })  
} catch(e){
    req.flash('error', e.message);
    res.redirect('register');
}
    // new User({})
}));

router.get('/login', (req, res) => {
    res.render('users/login')
} )

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = req.session.returnTo || '/loaders';
    delete req.session.returnTo;
    res.redirect(redirectURL);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Goodbye");
    res.redirect('/');
})

module.exports = router;