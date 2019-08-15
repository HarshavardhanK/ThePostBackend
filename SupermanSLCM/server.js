const express = require('express')
const bodyParser = require('body-parser');

const scraper = require('./scraper');
const database = require('./database');

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/values', function(req, res) {

    const reg = req.body.regNumber;
    const pass = req.body.pass;
  
    const SHOULD_GET_MARKS = false;
    const SHOULD_GET_ATT = false;
    const GET_GRADES = false;

    console.log(reg);

    /*try {
        database.insert_response(reg, res);

    } catch(error) {
        console.log(error);
    }*/
  
    /*scraper.scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, '').then((value) => {
      console.log("success");
  
    }).catch((error) => {
      console.log(error);
    });*/

  })

  app.listen(3001, () => {
      console.log('listening at 3001');
  });