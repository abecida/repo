const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');
var mkdirp = require('mkdirp');
const { validationResult } = require('express-validator/check');
const crypto = require('crypto');

var NodeWebcam = require( "node-webcam" );

const User = require('../models/user');
const University = require('../models/university');
const Subject = require('../models/subject');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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' 
    }
}));
// Larry Abecid: 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
// cmlee3211: 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

var opts = {
    //Picture related
    width: 1280,
    height: 720,
    quality: 100,
 
    //Delay in seconds to take shot
    //if the platform supports miliseconds
    //use a float (0.1)
    //Currently only on windows
    delay: 0,
 
    //Save shots in memory
    saveShots: true,
 
    // [jpeg, png] support varies
    output: "jpeg",
 
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
 
    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",
 
    //Logging 
    verbose: false
};

var Webcam = NodeWebcam.create( opts );

var getClientIp = function(req) {
    return (req.headers["X-Forwarded-For"] ||
    req.headers["x-forwarded-for"] ||
    '').split(',')[0] ||
   req.client.remoteAddress;
};

exports.getSignup = (req, res, next) => {
    if(req.query.retry == "true"){
        return res.render('auth/signup', {path:'/signup', title:'Signup', errorMessage:null, name:false, validationErrors:[]});
    }
    return res.render('auth/signup', {path:'/signup', title:'Signup', errorMessage:null, name:false, validationErrors:[]});
};

exports.postSignup = (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const school_email = req.body.type_email;
    const later_half_school_email = req.body.later_half_school_email;
    const school_name = req.body.school_name;
    const school_real_name = req.body.real_name;
    const password = req.body.pw2;
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) return res.status(422).render('auth/signup', {path: '/signup', title: 'Signup', message: errors.array()[0].msg, first_name:first_name, last_name:last_name, email:school_email,password:password, school:school_name, school_real_name:school_real_name, validationErrors: errors.array()});
    User.findOne({school_email:school_email+later_half_school_email}).then(userDoc => {
        if(userDoc) {
            //return Promise.reject('Use a different email address');
            return res.render('auth/signup', {retry:true, path:'/signup',title:'Signup',first_name:first_name,last_name:last_name,school_email:school_email,password:password, message: 'Use a different email'});
        }
        University.find({name:school_real_name}).then(university => {
            if(!university){
                return res.render('auth/signup', {retry:true, path:'/signup',title:'Signup',first_name:first_name,last_name:last_name,school_email:school_email,password:password, message: 'Use a different email'});
            }
            crypto.randomBytes(8, (err, buffer) => {
                if(err) res.redirect('/reset');
                const token = buffer.toString('hex');
                const verifyToken = token;
                const verifyTokenExpiration = Date.now() + 3600000;
                const u = {...university[0]._doc};
                var date = new Date();
                var utcDate = new Date(date.toUTCString());
                utcDate.setHours(utcDate.getHours()-8);
                var pacificDate = new Date(utcDate);
                const user = new User({
                    school_email:school_email+later_half_school_email,
                    first_name:first_name,
                    last_name:last_name,
                    school:u,
                    password: password, //hashedPassword,
                    school_verified: false,
                    join_date:pacificDate,
                    verifyToken:verifyToken,
                    verifyTokenExpiration:verifyTokenExpiration,
                    image: 'images/default_user.png',
                    group: [],
                    interests: [],
                    bio: '',
                    liked:[],
                    follwing:[],
                    followers:[],
                    locations:[]
                });
                return user.save().then(result => {
                    req.flash('message', 'Verification Email Sent.');
                    res.setHeader('Set-Cookie', 'message=Verification Email Sent');
                    res.redirect('/login');
                    console.log(`http://localhost:3000/verify/${verifyToken}`);
                    return transporter.sendMail({
                        to:school_email+later_half_school_email,
                        from:'do-not-reply@abecid.org',
                        subject: 'Signup Succeeded',
                        html: `<h1>You signed up!</h1><br><p>To verify your account click <a href="http://localhost:3000/verify/${verifyToken}">here</a></p>`
                    });
                })
            });
        });
        // Encrypt Password here some time
        
        /*
        .then(result => {
            const verifyToken = result[0];
            const verifyTokenExpiration = result[1];
            bcrypt.hash(password, 12).then(hashedPassword => { //return in the beginning if User.findone is used
                const user = new User({
                    school_email:school_email+later_half_school_email,
                    first_name:first_name,
                    last_name:last_name,
                    password: password, //hashedPassword,
                    school_verified: false,
                    join_date:new Date(),
                    verifyToken:verifyToken,
                    verifyTokenExpiration:verifyTokenExpiration,
                    image: 'images/default_user.png'
                });
                return user.save();
            })
        });
        */    
    })
    //.catch(err => console.log(err));
}

exports.getVerify = (req, res, next) => {
    const token = req.params.token;
    User.findOne({verifyToken:token}).then(user => {
        if(!user) {
            res.setHeader('Set-Cookie', 'error=Invalid Token');
            res.redirect('/error');
        }
        if(user.school_verified){
            // return res.redirect('/');
        }
        req.session.tmp_user = user;
        user.school_verified = true;
        return user.save().then(result => {
            const school_email = user.school_email.split('@')[1];
            University.findOne({email:school_email}).then(university => {
                university.students.push({student:{...user._doc}});
                return university.save().then(result => {
                    return req.session.save(err => {
                        if(err) console.log(err);
                        console.log(req.session.tmp_user);
                        return res.render('auth/new-signin', {path:'/new-signin', title:'Verify', message: false, userId:user._id.toString(), user:user});
                    });
                });
            });
        });
    });
};

exports.postVerify = (req, res, next) => {
    const token = req.params.token;
    User.findOne({verifyToken:token}).then(user => {
        if(!user) {
            res.setHeader('Set-Cookie', 'error=Invalid Token');
            res.redirect('/error');
        }
        if(user.school_verified){
            // return res.redirect('/');
        }
        req.session.tmp_user = user;
        user.school_verified = true;
        return user.save().then(result => {
            return req.session.save(err => {
                if(err) console.log(err);    
                return res.render('auth/new-signin', {path:'/new-signin', title:'Verify', message: false, userId:user._id.toString(), user:user});
            });
        });
    });
};

exports.finish_signup = (req, res, next) => {
    const userId = req.body.userId;
    const userName = req.body.username;
    const major = req.body.major;
    const image = req.file;
    const subjectId = req.body.subjectId;
    User.findById(userId).then(user => {
        Subject.findById(subjectId)
        .then(subject => {
            if(req.user && user._id.toString() != req.user._id.toString()) {
                return res.redirect('/');
            } 
            user.user_name = userName;
            user.major = major;
            if(image) user.image = image.path;
            return user.save().then(result => {
                subject.majors.push({student:{...user._doc}});
                return subject.save().then(result => {
                    res.redirect('/login');
                }).catch(err => {
                    console.log(err);
                    return res.redirect('/login');
                });
            });
        });
    });
};

exports.checkUsername = (req, res, next) => {
    const username = req.query.name;
    User.findOne({user_name:username}).then(user => {
        if(!user) {
            res.status(200).json({cool:true});
        } else {
            res.status(200).json({cool:false});
        }
    });
};

exports.getLogin = (req, res, next) => {
    let cookies = '';
    if(req.get('Cookie')) cookies = req.get('Cookie').split(';');
    message = false;
    for(const message in cookies) {
        if(message.includes("message")){
            message = message.split("=")[1];
        }
    }
    return res.render('auth/login', {path:'/login', title:'Login', message:message, name:false, validationErrors:[]});
};

exports.postLogin = (req, res, next) => {
    //res.setHeader('Set-Cookie', 'loggedIn=true'); // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10');
    // req.get('Cookie').split(';')[1].trim().split('=')[1];
    const email = req.body.email;
    const password = req.body.password;
    let email_type = '';
    if(email.includes(".edu")) {
        email_type = 'School';
    } else if(email.includes("@")){
        email_type = 'Personal';
    } else {
        email_type = 'Username';
    }

    if(email_type == 'School'){
        console.log(email);
        return User.findOne({school_email:email}).then(user => {
            if(!user){
                req.flash('error', 'Invalid email address');
                return res.render('auth/login', {path:'/login', title:'Login', password:password,email:email,message:req.flash('error')})
            }
            const name = user.first_name;
            if(user.password === password) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.first_name = name;
                return req.session.save(err => {
                    if(err) console.log(err);    
                    return res.redirect('/');
                });
            }
        }).catch(err => console.log(err));
    } else if(email_type == 'Personal') {
        return User.findOne({school_email:email}).then(user => {
            if(!user){
                req.flash('error', 'Invalid email address');
                return res.render('auth/login', {path:'/login', title:'Login', password:password,email:email,message:req.flash('error')})
            }
            const name = user.first_name;
            if(user.password === password) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.first_name = name;
                return req.session.save(err => {
                    if(err) console.log(err);
                    return res.redirect('/');
                });
            }
        }).catch(err => console.log(err));
    } else {
        console.log(email);
        return User.findOne({user_name:email}).then(user => {
            if(!user){
                req.flash('error', 'Invalid Email Address or Password');
                return res.render('auth/login', {path:'/login', title:'Login', password:password,email:email,message:req.flash('error')})
            }
            const name = user.first_name;
            console.log(name);
            if(user.password === password) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                req.session.first_name = name;
                return req.session.save(err => {
                    if(err) console.log(err);
                    return res.redirect('/');
                });
            }
        }).catch(err => console.log(err));
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log(err);
        res.redirect('/');
    });
};

exports.getSubjects = (req, res, next) => {
    const subject = req.query.name;
    Subject.find({name: {$regex: subject,'$options': 'i'}}, null, {sort:{name:1}, limit:20})
    .then(subjects => {
        return res.status(200).json({subjects:subjects});
    }).catch(err => {
        console.log(err);
        return res.status(500).json({error:err});
    });
};

exports.getUniversities = (req, res, next) => {
    const university = req.query.name;
    University.find({name:{$regex: university,'$options': 'i'}}, null, {sort:{name:1},limit:20})
    .then(universities => {
        return res.status(200).json({universities:universities});
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({error:err});
    });
};

exports.getForgot = (req, res, next) => {
    res.render('auth/forgot', {path: '', title:'Reset', message:''});
};

exports.resetPassword = (req, res, next) => {
    const send = true;
    User.findOne({school_email:req.body.email})
    .then(user => {
        if(!user) {
            // req.flash('error', 'Invalid email address');
            // return res.redirect('/reset'); 
            send = false;
            return res.render('auth/reset', {path:'/reset', title:'Reset', message:'Invalid email address'})
        }
        crypto.randomBytes(8, (err, buffer) => {
            if(err) res.redirect('/reset');
            const token = buffer.toString('hex');
            user.resetToken = token;
            console.log(token);
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        });
    }).then(result => {
        if(send) {
            res.render('auth/login', {path:'login', title:'Login', message:'Email Sent'})
            return transporter.sendMail({
                to: req.body.email,
                from:'do-not-reply@ame.com',
                subject: 'Password Reset',
                html: //'<h1>Your temporary password which will expire in one hour is '+token+'</h1>'
                `<p><a href="http://localhost:3000/reset/${token}">Click Here</a></p>`
            });
        }
    }).catch(err => console.log(err));
}

exports.getReset = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken:token, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
        res.render('auth/new-password', {path:'/new-password', title:'New Password', message: false, userId:user._id.toString()})
    });
}

exports.postNewPassword = (req, res, next) => {
    const userId = req.body.userId;
    User.findOne({_id:userId}).then(user => {
        user.password = req.body.password;
        user.token = undefined;
        user.tokenExpiration = undefined;
        return user.save();
    }).then(result => {
        res.render('auth/login', {path: 'login', title:'Login', message:'Password Updated'});
    });
}

exports.getError = (req, res, next) => {
    error = 'Our Mistake, Please Go Back to the Home Page';
    const messages = req.get('Cookie').split(';');
    for(const error in messages) {
        if(error.includes("error")){
            error = error.split("=")[1];
        }
    }
    res.render('auth/error', {path:'/error', title: 'Error', message:error})
};

exports.postSignout = (req, res, next) => {
    req.session.destroy(() => {
        res.setHeader('Set-Cookie', `name=${null}`);
        res.redirect('/');
    });
};