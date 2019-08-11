const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

var Helper = require('./modules/helper');
var deasync = require('deasync');

const bodyParser = require('body-parser');
var port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//reg and pass are necessary for login.

//const reg = <registration number of user>;
//const pass = <password of the user's account>;
//const SHOULD_GET_ALL_SEMS = <true or false>;

//NOTE: getting all sems is slower than getting current sem.
//NOTE: please use the variable names as mentioned above.

let scrape = async (reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, semToFetch) => {

  const browser = await puppeteer.launch({args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote'
  ], headless:true});

  const helper = new Helper(browser, SHOULD_GET_MARKS, res, GET_GRADES, SHOULD_GET_ATT, semToFetch);
  try{
    helper.executeLogin(reg, pass);
  }
  catch(error){
      utilities.displayError("Unknown Error Encountered. Please Try Again.",res);
  }

};

app.get('/', function(req, res) {
  var jsonData = {
    'Current sem marks and attendance' : 'http://slcmapi.herokuapp.com/slcmValues',
    'All sem grade sheet' : 'http://slcmapi.herokuapp.com/slcmGrades',
    'All sem marks' : 'http://slcmapi.herokuapp.com/slcmMarks',
    'All sem attendance' : 'http://slcmapi.herokuapp.com/slcmAttendance',
    'NOTE' : 'Due to SLCM bug, only overall internal marks is visible.',
    'FOOTER' : 'Copyright 2019 The MIT Post'
  };

  res.send(jsonData);
});

app.get('/slcmValues', function(req, res) {

  var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='values'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

  res.send(toBeSent);
});


app.get('/slcmGrades', function(req, res) {

  var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='grades'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

  res.send(toBeSent);
});

app.get('/slcmMarks', function(req, res) {

  var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='marks'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

  res.send(toBeSent);
});

app.get('/slcmAttendance', function(req, res) {

  var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='attendance'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

  res.send(toBeSent);
});

app.post('/values', function(req, res) {

  const reg = req.body.regNumber;
  const pass = req.body.pass;

  const SHOULD_GET_MARKS = false;
  const SHOULD_GET_ATT = false;
  const GET_GRADES = false;

  scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, '').then((value) => {
    console.log("success");

  }).catch((error) => {
    console.log(error);
  });
})

app.post('/marks', function(req, res) {

  const reg = req.body.regNumber;
  const pass = req.body.pass;
  const get_sem = req.body.sem;

  const SHOULD_GET_MARKS = true;
  const SHOULD_GET_ATT = false;
  const GET_GRADES = false;

  scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
    console.log("success");

  }).catch((error) => {
    console.log(error);
  });
})

app.post('/attendance', function(req, res) {

  const reg = req.body.regNumber;
  const pass = req.body.pass;
  const get_sem = req.body.sem;

  const SHOULD_GET_MARKS = false;
  const SHOULD_GET_ATT = true;
  const GET_GRADES = false;

  scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
    console.log("success");

  }).catch((error) => {
    console.log(error);
  });
})

app.post('/grades', function(req, res) {

  const reg = req.body.regNumber;
  const pass = req.body.pass;
  const get_sem = req.body.sem;

  const SHOULD_GET_MARKS = false;
  const SHOULD_GET_ATT = false;
  const GET_GRADES = true;

  scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
    console.log("success");

  }).catch((error) => {
    console.log(error);
  });
})

app.listen(port);