const puppeteer = require('puppeteer');

const Subject = require('../models/subject');
const Category = require('../models/category');

const domain = 'https://collegemajors101.com/';

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://abecid:chaemin3211@cluster0-kya1m.mongodb.net/forum';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
    console.log('Connected to DB');

    scrape().then((value) => {
        index = 0;
        while(index < value.length){
            const subject = value[index][0];
            const category = value[index][1];
            console.log(subject, category);
            // save_subject(subject);
            save(subject, category);
            index += 1;
        }
    }).catch(err => console.log(err));
}).catch(err => console.log(err));

function save_subject(subject_name) {
    const subject = new Subject({
        name:subject_name
    });
    return subject.save().then(result => {
        console.log(subject_name+" saved");
    }).catch(err => console.log(err));
}

function save(subject_name, category_name) {
    Subject.findOne({name:subject_name}).then(subject => {
        Category.findOne({name:category_name}).then(category => {
            console.log(category.name);
            subject.category = {_id:category._id, name:category.name};
            return subject.save().then(result2 => {
                console.log("Saved")
            }).catch(err => console.log(err));
        })
    });
};

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    await page.goto(domain);
    
    const result = await page.evaluate(async () => {
        all_groups = [];
        let categories = document.getElementsByClassName("home-major-list-item");
        for(let category of categories) {
            const category_name = category.getElementsByTagName('SPAN')[1].textContent;
            subjects = category.getElementsByTagName('A');
            for(let subject of subjects) {
                all_groups.push([subject.textContent, category_name]);
            }
        }
      return all_groups;
    });

    browser.close();
    return result;
};