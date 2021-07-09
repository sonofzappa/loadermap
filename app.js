const express = require('express');
const path =  require('path');
const mongoose = require('mongoose');
const Loader = require('./models/loader');

mongoose.connect('mongodb://localhost:27017/loader-app', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));


// ROUTES //
app.get('/', (req, res) => {
    res.render('home')
});


// LOADER ROUTES //

//LOADERS INDEX //
app.get('/loaders', async (req, res) => {
    const loaders = await Loader.find({});
    res.render('loaders/index', { loaders })
})

// LOADER NEW ROUTE //
app.get('/loaders/new', (req, res) => {
    res.render('loaders/new')
});

// LOADER SHOW ROUTE //
app.get('/loaders/:id', async (req, res) => {
    const loader = await Loader.findById(req.params.id);
    console.log(loader)
    res.render('loaders/show', { loader });
});

// LOADER CREATE ROUTE //
app.post('/loaders', async (req, res) => {
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
});

//LOADER EDIT ROUTE //
app.get('/loaders/:id/edit', catchAsync(async (req, res) => {
    const loader = await Loader.findById(req.params.id)
    res.render('loaders/edit', { loader });
}))

// LOADER UPDATE ROUTE //
app.put('/loaders/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const loader = await Loader.findByIdAndUpdate(id, { ...req.body.loader });
    res.redirect(`/loaders/${loader._id}`)
}))

//LOADER REMOVE ROUTE //

app.delete('/loaders/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Loader.findByIdAndDelete(id);
    res.redirect('/loaders');
}))

// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// })

// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = 'Oh No, Something Went Wrong!'
//     res.status(statusCode).render('error', { err })
// })

app.listen(3000, () => {
    console.log("Listening on Port 33")
})