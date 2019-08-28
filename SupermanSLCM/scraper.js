const Helper = require('./modules/helper');
const puppeteer = require('puppeteer');


let scrape = async (reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, semToFetch) => {

    const browser = await puppeteer.launch({args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote'
    ], headless:false});

    const helper = new Helper(browser, SHOULD_GET_MARKS, res, GET_GRADES, SHOULD_GET_ATT, semToFetch);
    try{
      helper.executeLogin(reg, pass);
    }
    catch(error){

      if(res) {
        utilities.displayError("Unknown Error Encountered. Please Try Again.",res);

      } else {
        console.log('error executing script');
      }

    }

  };



  module.exports.scrape = scrape;
