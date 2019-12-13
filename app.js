const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const expressip = require('express-ip');
const csrf = require('csrf');
const multer = require('multer');
const flash = require('connect-flash');
var mkdirp = require('mkdirp');

const db = require('./util/database');

const User = require('./models/user');

const compression = require('compression');
const morgan = require('morgan');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-kya1m.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
// const MONGODB_URI = 'mongodb+srv://abecid:chaemin3211@cluster0-kya1m.mongodb.net/shop';

const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination:(req, file, cb)=> {
        let user = 'common';
        if(req.user){
            user = req.user.school_email;
        }
        date = new Date()
        date_string = date.toUTCString();
        month = date.getMonth();
        day = date.getDate();
        hour = date.getHours();
        minute = date.getMinutes();
        second = date.getSeconds();
        current_datetime = month+'_'+day+'_'+hour+'_'+minute+'_'+second;
        today = month+'_'+day;
        now = hour+'_'+minute+'_'+second;
        mkdirp('images/'+user+'/', function(err) {
            cb(null, 'images/'+user+'/'); 
        });
    },
    filename: (req, file, cb) => {
        cb(null, current_datetime+'_'+file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') cb(null, true);
    else cb(null, false);
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const auth = require('./routes/auth.js');
const admin = require('./routes/admin.js');
const forum = require('./routes/forum.js');
const people = require('./routes/people.js');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(expressip().getIpInfoMiddleware);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter:fileFilter}).single('image')); // dest:'images'
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({secret:'my secret', resave:false, saveUninitialized: false, store:store})
);
// session({secret:'my secret', resave:false, saveUninitialized: false, store:store, cookie:{maxAge:10, expires:10}})

app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) return next();
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
        throw new Error(err);
    });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    if(!req.user) {
        res.locals.first_name = null;
        return next();
    }
    res.locals.userId = req.user._id;
    res.locals.userImage = req.user.image;
    res.locals.first_name = req.user.first_name;
    if(req.user.user_name) {
        res.locals.first_name = req.user.user_name;
    }
    next();
});

// app.use(csrfProtection);
/*
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
});
*/

app.use(auth);
app.use('/admin', admin);
app.use(forum);
app.use(people);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
    app.listen(process.env.PORT || 3000);
    console.log('Listening at port 3000');
}).catch(err => console.log(err));

/*
mkdirp('images/'+today+'/', function(err) {
    let writeStream = fs.createWriteStream('./textfiles/'+today+'/secret.txt');
    if(name.length > 0) writeStream.write('name : '+name+'\n');
    else writeStream.write('name : User\n');
    writeStream.write('date : '+date_string+'\n');
    writeStream.write('ip : '+ip+'\n');
    writeStream.on('finish', () => {
        console.log('wrote all data to file');
    });
    writeStream.end();
});
*/