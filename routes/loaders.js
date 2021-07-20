const express = require('express');
const router = express.Router();
const loaders = require('../controllers/loaders');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateLoader } = require('../middleware')

const Loader = require('../models/loader');


// INDEX //
router.get('/', isLoggedIn, catchAsync(loaders.index));

// NEW ROUTE //
router.get('/new', isLoggedIn, loaders.renderNewForm);

// SHOW ROUTE //
router.get('/:id', isLoggedIn, catchAsync(loaders.show));

// CREATE ROUTE //
router.post('/', isLoggedIn, validateLoader, catchAsync(loaders.createLoader));

// EDIT ROUTE //
router.get('/:id/edit', isLoggedIn, isAuthor,  catchAsync(loaders.renderEditForm));


// UPDATE ROUTE //
router.put('/:id', isLoggedIn, isAuthor, validateLoader, catchAsync(loaders.updateLoader));

// REMOVE ROUTE //

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(loaders.deleteLoader));

module.exports = router;