const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
var multer  = require('multer')
const dotenv = require('dotenv')
var upload = multer({ dest: 'uploads/' })
dotenv.config({path:'./config/config.env'})

const errorController = require('./controllers/error');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorRoutes = require('./routes/error');

const store = new MongoSessionStore({
    uri: process.env.MongoURI,
    collection: 'mySessions'
});

//static file
//app.use('/images',express.static(path.join(__dirname,'public','uploads')))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    name: 'Tes',
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;

    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use(errorController.get404);
const PORT = process.env.PORT || 3000
mongoose.connect(process.env.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('db connected ....');
        app.listen(PORT);
    }).catch(err => console.error(err));

