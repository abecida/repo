const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');
var mkdirp = require('mkdirp');
const { validationResult } = require('express-validator/check');
const crypto = require('crypto');

const Post = require('../models/post');

const ITEMS_PER_PAGE = 20;

var getClientIp = function(req) {
    return (req.headers["X-Forwarded-For"] ||
    req.headers["x-forwarded-for"] ||
    '').split(',')[0] ||
   req.client.remoteAddress;
};

exports.getMain = (req, res, next) => {
    ip = getClientIp(req);
    name= 'user';
    date = new Date()
    date_string = date.toUTCString();
    month = date.getMonth();
    day = date.getDate();
    hour = date.getHours();
    minute = date.getMinutes();
    current_datetime = month+'_'+day+'_'+hour+'_'+minute;
    today = month+'_'+day;

    if(req.user) {
        name = req.user.first_name;
    }
    filename = name+'_'+current_datetime;

    let page;
    let totalItems;
    let numPages;
    if(req.query.page) page = req.query.page
    else page = 1;

    Post.find().countDocuments().then(numProducts => {
        totalItems = numProducts;
        if(totalItems%ITEMS_PER_PAGE>0) numPages = totalItems/ITEMS_PER_PAGE;
        else if(totalItems%ITEMS_PER_PAGE==0) numPages = totalItems/ITEMS_PER_PAGE;
        return Post
        .find()
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(posts => {
        posts.sort((a, b) => {
            (a.liked.length > b.liked.length) ? -1 :
            (a.liked.length == b.liked.length) ?
            ((a.poster.followers.length > b.poster.followers.length) ? -1 : 1)
            : 1
        });
        res.render('main/main', {posts: posts, title: 'Ame', path: '/', page:page, numPages:numPages});
    }).catch(err => console.log(err));
};

exports.getPost = (req, res, next) => {

};

exports.getProfile = (req, res, next) => {

};

exports.postPost = (req, res, next) => {

};

exports.getAddPost = (req, res, next) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    res.render('forum/add-post-simple', {path:'/add', title:'Add Post', message: false});
};

exports.savePost = (req, res, next) => {

};