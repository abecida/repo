const puppeteer = require('puppeteer');

const University = require('../models/university');
const Subject = require('../models/subject');

const domain = 'https://collegemajors101.com/';

const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://abecid:chaemin3211@cluster0-kya1m.mongodb.net/forum';
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(result => {
    console.log('Connected to DB');

    scrape().then((value) => {
        index = 0;
        while(index < value.length){
            const name = value[index][0];
            const email = value[index][1];
            save(name, email);
            index += 1;
        }
    }).catch(err => console.log(err));
}).catch(err => console.log(err));

function save(name, email) {
    const university = new University({
        name:name,
        email:email
    });
    
    return university.save().then(result => {
        console.log("saved");
    }).catch(err => {
        console.log(err);
    });
};

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1200, height: 720});
    await page.goto(domain);
    

    const result = await page.evaluate(async () => {
        let universities = document.getElementsByTagName('LI');
        all_groups = [];
        for (let university of universities){
            let name = university.getElementsByTagName('A')[0].textContent.replace("\n", "").replace("\t", "").replace(/\s+/g, ''); // .replace(/\s+/g, '')
            let index = 0;
            while(index < name.length){
                if(index != 0 && name.charCodeAt(index) >= 65 && name.charCodeAt(index) <= 90){
                    name = name.slice(0, index) + " " + name.slice(index);
                    index += 1;
                }
                index += 1;
            }
            if(name.indexOf("of ") > 0) {
                index = name.indexOf("of ");
                name = name.slice(0, index) + " " + name.slice(index);
            }

            const email_index = university.textContent.indexOf(".edu");
            const parantheses_index = university.textContent.indexOf("(");
            const parantheses_index2 = university.textContent.indexOf(")");
            const email = university.textContent.substring(parantheses_index+1, parantheses_index2);
            const group = [name, email];
            all_groups.push(group)
        }
      return all_groups;
    });

    

    browser.close();
    return result;
};


scrape().then((value) => {
    let counter = 0;
    index = 0;
    while(index < value.length){
        const name = value[index][0];
        const email = value[index][1];
        const university = new University({
            name:name,
            email:email
        });
        
        return university.save().then(result => {
            console.log("saved", university);
        }).catch(err => {
            console.log(err);
            console.log('email is ', value[index]);
            console.log('index is ', index);
        });
        
        console.log(counter, university2);
        counter += 1;
        index += 1;
    }
}).catch(err => console.log(err));