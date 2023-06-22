const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const mongoose = require('mongoose');


const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf')
const flash = require('connect-flash');


const errorControlles = require('./controllers/error');

const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const userreuts = require('./routes/shop');
const aythReuts = require('./routes/auth');
const port = 5000

const MONGODB_URI = 'mongodb://localhost:27017/shop'
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))


app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id)
            .then(user => {
                req.user = user
                next();
            })
            .catch(err => console.log(err))
    }


})

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    //نرسل البيانات ضمنيا عند كل رد
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})



app.use('/admin', adminRoutes);
app.use(userreuts);
app.use(aythReuts);

app.use(errorControlles.getError);


mongoose
    .connect(MONGODB_URI)
    .then(reuslt => {
        app.listen(port); //http by dif
    })
    .catch(err => {
        console.log(err);
    })





