
const puppeteer = require('puppeteer');

var Helper = require('./modules/helper');
var utilities = require('./utilities')
var encrypt = require('./encryption');
var database = require('./database');


//reg and pass are necessary for login.

//const reg = <registration number of user>;
//const pass = <password of the user's account>;
//const SHOULD_GET_ALL_SEMS = <true or false>;

//NOTE: getting all sems is slower than getting current sem.
//NOTE: please use the variable names as mentioned above.

//Define the collections for MongoDb

let COLLECTIONS = {
    IOS_COLLECTION: 'ios',
    MARKS_COLLECTION: 'marks',
    ATTENDANCE_COLLECTION: 'attn',
    RESPONSE_COLLECTION: 'response',
    CREDS_COLLECTION: 'creds',
    GRADES_COLLECTION: 'grades',
  };


module.exports.scrape = scrape = async (reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, semToFetch) => {

  /*const browser = await puppeteer.launch({args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote'
  ], headless:true});*/

  const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' });

  console.log('Opening browser')

  const helper = new Helper(browser, SHOULD_GET_MARKS, res, GET_GRADES, SHOULD_GET_ATT, semToFetch);
  try{

    return helper.executeLogin(reg, pass);

  }
  catch(error){

    utilities.displayError("Unknown Error Encountered. Please Try Again.",res);

  }

};

module.exports.getSLCMHome = (app) => {

  app.get('/slcm', function(req, res) {
    var jsonData = {
      'Current sem marks and attendance' : 'https://app.themitpost.com/slcmValues',
      'All sem grade sheet' : 'https://app.themitpost.com/slcmGrades',
      'All sem marks' : 'https://app.themitpost.com/slcmMarks',
      'All sem attendance' : 'https://app.themitpost.com/slcmAttendance',
      'NOTE' : 'Due to SLCM bug, only overall internal marks is visible.',
      'FOOTER' : 'Copyright 2019 The MIT Post'
    };

    res.send(jsonData);
  });

}

module.exports.getSLCMValues = (app) => {

  app.get('/slcmValues', function(req, res) {

    var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='values'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

    res.send(toBeSent);
  });

}

module.exports.getSLCMGrades = (app) => {

  app.get('/slcmGrades', function(req, res) {

    var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='grades'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

    res.send(toBeSent);
  });

}

module.exports.getSLCMMarks = (app) => {

  app.get('/slcmMarks', function(req, res) {

    var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='marks'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

    res.send(toBeSent);
  });

}

module.exports.getSLCMAttendance = (app) => {

  app.get('/slcmAttendance', function(req, res) {

    var toBeSent = "<html><head><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>SLCM by The MIT Post</title></head><body><h3>SLCM Scraper User UI</h3><br><form method='post' action='attendance'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td><tr><td>Semester to fetch: </td><td><select name='sem'><option value='I'>I</option><option value='II'>II</option><option value='III'>III</option><option value='IV'>IV</option><option value='V'>V</option><option value='VI'>VI</option><option value='VII'>VII</option><option value='VIII'>VIII</option></td></tr></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br><br>SLCM Scraper v4.6.1-beta</h6></p></body></html>"

    res.send(toBeSent);
  });

};

module.exports.deleteCredential = (app) => {

  app.post('/slcm/purge', function(request, response) {

    const reg = request.body.regNumber;

    if(reg) {

      database.delete_credential(reg);
      //delete from marks database as well
      response.json({"status": "OK"});

    } else {
      response.json({"status": "NOTFOUND"});
    }

  })

}

module.exports.postValues = (app) => {

  app.post('/values', function(req, res) {

    const reg = req.body.regNumber;
    const pass = req.body.pass;
    const key = req.body.key

    /*if(key) {
      if(key !== "joker01124713115BatmanThanos") {
        res.json({status: false})
      }
    } else {
      res.json({status: false})
      return
    }*/

    var fcm_token = null;

    if(req.body.fcm_token) {
      fcm_token = req.body.fcm_token;
    }

    console.log(req.body);

    const SHOULD_GET_MARKS = false;
    const SHOULD_GET_ATT = false;
    const GET_GRADES = false;

    console.log(COLLECTIONS.IOS_COLLECTION);

    database.get_slcm_data({registration: reg, password: pass}, COLLECTIONS.IOS_COLLECTION).then(response => {

      if(!response) {

        scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, '').then((value) => {

          console.log("success");

          let new_value = utilities.sanitize(value)
          console.log(new_value);

          res.send(new_value);

          database.insert_credentials({_id: reg, registration: reg, password: pass, token: fcm_token})

          database.insert_slcm_data({_id: reg, registration: reg, password: pass}, new_value, COLLECTIONS.IOS_COLLECTION);


        }).catch((error) => {
          console.log(error);
          res.send({message: 'Invalid Credentials'})

        });

      } else {
        res.send(response);

      }

    }).catch(error => {
      console.log(error);
      //response.send({message: 'BAD'});
    });

  });

};

module.exports.update_credentials = (app) => {

  app.post("/credential", function(request, response) {

    const registration = request.body.regNumber
    const password = request.body.pass
    const token = request.body.fcm_token

    const action = request.body.action

    if (action === 'update' || action === "insert") {

      console.log('Updating credentials for %s to token %s', registration, token)

      database.insert_credentials({_id: registration, registration: registration, password: password, token: token, status: "active"}).then(result => {
        console.log("Successfully inserted credentials | Status active")

        response.json({"status": "OK"})
  
      }).catch(error => {
        console.log(error)
        response.json({"status": "BAD"})
      })

    } else if(action === "delete") {
      //code for delete
      database.insert_credentials({_id: registration, registration: registration, password: password, token: token, status: "inactive"}).then(result => {
        console.log("DEACTIVATED NOTIFICATIONS")
        response.json({"status": "OK"})

      }).catch(error => {
        response.json({"status": "BAD"})
      })
    }

  })

}

module.exports.postSLCMValuesForUpdate = (app) => {

  app.post('/values/update', function(request, response) {

    const registration = request.body.regNumber;
    const password = request.body.pass;

    const SHOULD_GET_MARKS = false;
    const SHOULD_GET_ATT = false;
    const GET_GRADES = false;

    scrape(registration,password,response, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, '').then((value) => {

      console.log("success")
      response.send(value);

    }).catch((error) => {

      console.log(error);
      //return {message: 'BAD'};

    });

  });

}

module.exports.postMarks = (app) => {

  app.post('/marks', function(req, res) {

    const reg = req.body.regNumber;
    const pass = req.body.pass;
    const get_sem = req.body.sem;

    const SHOULD_GET_MARKS = true;
    const SHOULD_GET_ATT = false;
    const GET_GRADES = false;

    database.get_slcm_data({registration: reg, password: pass, semester: get_sem}, COLLECTIONS.MARKS_COLLECTION).then(response => {

      if(!response) {

        scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
          console.log("success");

          res.send(value);

          database.insert_slcm_data({registration: reg, password: pass, semester: get_sem}, value, COLLECTIONS.MARKS_COLLECTION);

        }).catch((error) => {
          console.log(error);
        });

      } else {
        res.send(response);
      }

    });

  });

};


module.exports.postAttendance = (app) => {

  app.post('/attendance', function(req, res) {

    const reg = req.body.regNumber;
    const pass = req.body.pass;
    const get_sem = req.body.sem;

    const SHOULD_GET_MARKS = false;
    const SHOULD_GET_ATT = true;
    const GET_GRADES = false;

    database.get_slcm_data({registration: reg, password: pass, semester: get_sem}, COLLECTIONS.ATTENDANCE_COLLECTION).then(response => {

      if(!response) {

        scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
          console.log("success");

          database.insert_slcm_data({registration: reg, password: pass, semester: get_sem}, value, COLLECTIONS.ATTENDANCE_COLLECTION);

          res.send(value);

        }).catch((error) => {
          console.log(error);
        });

      } else {
        res.send(response);

      }
    });


  });

}

module.exports.postGrades = (app) => {

  app.post('/grades', function(req, res) {

    const reg = req.body.regNumber;
    const pass = req.body.pass;
    const get_sem = req.body.sem;

    const SHOULD_GET_MARKS = false;
    const SHOULD_GET_ATT = false;
    const GET_GRADES = true;

    database.get_slcm_data({registration: reg, password: pass, semester: get_sem}, COLLECTIONS.GRADES_COLLECTION).then(response => {

      if(!response) {

        scrape(reg,pass,res, SHOULD_GET_MARKS, GET_GRADES, SHOULD_GET_ATT, get_sem).then((value) => {
          console.log("success");

          res.send(value);

          database.insert_slcm_data({registration: reg, password: pass, semester: get_sem}, value, COLLECTIONS.GRADES_COLLECTION);

        }).catch((error) => {
          console.log(error);
        });

      } else {
        res.send(response);
      }

    });

  });

};
