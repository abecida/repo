const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');
var mkdirp = require('mkdirp');

var NodeWebcam = require( "node-webcam" );
var Screenshot = require('desktop-screenshot');

const University = require('../models/university');

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

exports.getAdmin = (req, res, next) => {
    res.render('admin/admin', {title: 'Add', path: '/', userName:'Buddy'});
};

exports.postAddCollege = (req, res, next) => {
    const email = req.body.email;
    const name = req.body.name;
    const university = new University({
        name:name,
        email:email
    });
    return university.save().then(result => {
        res.redirect('/admin');
    });
};

exports.getUniversities = (req, res, next) => {
    return University.find().then(universities => {
        res.render('admin/universities', {universities:universities, userName:'Buddy', title:'Registered Universities', path:'/admin/universities', numPages:1, page:1});
    });
};