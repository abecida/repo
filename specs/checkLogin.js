const puppeteer = require('puppeteer');

const check = async (email, password) => {
    if(!email) email = '';
    if(!password) password = 'asdfasd';
    console.log(email);
    console.log(password);
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('https://myportal.calpoly.edu/');
    await page.waitForSelector('#username');
    await page.type('#username', email);
    await page.type('#password', password);
    await page.click('#preExpired > form > div.form-element-wrapper.submit-block > button');

    if (await page.url().indexOf("myportal") > -1) {
        await browser.close();
        return true;
    } 
    if(await page.url().indexOf("execution=e2s2") > -1 || await page.url().indexOf("execution=e1s2") > -1) {
        await browser.close();
        return false;
    } else {
        await browser.close();
        return false;
    }

};

module.exports.check = check;