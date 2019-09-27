
const express = require('express');
const path_ = require('path');
const bodyParser = require('body-parser');
var fs = require('fs');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const deasync = require('deasync');
const yargs = require('yargs');



const database = require('./Articles/database.js');
const articleWebView = require('./Articles/ArticleWebview/index');
const newSlcm = require('./SupermanSLCM/index');

var app = express();

const ARTICLES_COLLECTION = 'articles';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (request, response) => {

  console.log('Home page');

  const message = {

    message: "Welcome to the official API of The MIT Post",
    SLCM_UI_API: 'https://app.themitpost.com/slcmValues',
    SLCM_POST_ADDRESS: 'https://app.themitpost.com/values',
    ARTICLES_API: 'https://app.themitpost.com/posts',
    ARTICLE_TAG_API: 'https://app.themitpost.com/posts/TAG',
    ARTICLE_RAW_TAG_API: 'https://app.themitpost.com/posts/raw/TAG',
    EVENT_PORTAL: 'https://app.themitpost.com/portal/events',
    EVENT_PORTAL_API: 'https://app.themitpost.com/events',
    NOTICES_PORTAL: 'https://app.themitpost.com/portal/notice',
    NOTICES_PORTAL_API: 'https://app.themitpost.com/notices',


};

  response.json(message);

});

app.get('/posts', (request, response) => {

  query = {};
  console.log("/posts")

  database.query_skeleton_article_all(query, (data) => {

    if(data.length > 0) {

      console.log('Query successful');
      console.log(data);
      response.json(data);

    } else {
      response.json({"status": "BAD"});
    }

  });


});


app.get('/posts/raw/:tagId', (request, response) => {

   var id = parseInt(request.params.tagId);

   console.log('lolo');

  database.query_full_article({_id: id}, 'unfiltered', (data) => {

    if(data) {
      console.log("Querying raw article successful");
      response.json(data);

    } else {
      console.log("Querying raw articles threw error");

    }

  });


});

app.post('/save/raw', (request, response) => {

  console.log(response);
  console.log(response.data);

  database.insert_article(response.data, 'unfiltered');

});

//Calling artile web view get request

articleWebView.getWebContent(app);


//SLCM


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

newSlcm.getSLCMHome(app);

newSlcm.getSLCMValues(app);
newSlcm.postValues(app);

newSlcm.getSLCMMarks(app);
newSlcm.postMarks(app);

newSlcm.getSLCMGrades(app);
newSlcm.postGrades(app);

newSlcm.getSLCMAttendance(app);
newSlcm.postAttendance(app);

newSlcm.postSLCMValuesForUpdate(app);

//////////////////////////////////// EVENTS PORTAL ////////////////////////////////////////

const path = require('path');
const events_database = require('./Events/database.js');

app.get('/portal/events',function(req,res){
  res.sendFile(path.join(__dirname+'/Events/static/initial.html'));
});

app.post('/portal/events/submitted', function(request, response) {

  const club = request.body.club;
  const title = request.body.title;
  const content = request.body.content;
  const imageURL = request.body.imageURL;
  const date = request.body.date;
  const time = request.body.time;

  const event = {

    clubName: club,
    title: title,
    content: content,
    imageURL: imageURL,
    date: date,
    time: time

  };

  events_database.insert_event(event, error => {

    if(error) {
      throw (error);
    }
  });

  response.send("<h1>EVENT INSERTED<h1>");


});

app.get('/events', function(request, response) {

  events_database.get_event_all({}, result => {

    if(result) {
      result = {status: 'OK', data: result};
      response.json(result);

    } else {
      console.log('Nothing found..');
    }

  });

});


//////////// NOTICES PORTAL ////////////////////////////
const notices_database = require('./Notices/database.js');

app.get('/portal/notice',function(req,res){
  res.sendFile(path.join(__dirname+'/Notices/static/initial.html'));
});

app.post('/portal/notices/submitted', function(request, response) {

  const title = request.body.title;
  const content = request.body.content;
  const imageURL = request.body.imageURL;
  const date = request.body.date;
  const time = request.body.time;

  const notice = {
    title: title,
    content: content,
    imageURL: imageURL,
    date: date,
    time: time
  };

  notices_database.insert_notice(notice);

  response.send("<h1> NOTICE INSERTED </h1>");

});

app.get('/notices', function(request, response) {

  notices_database.get_notices_all(result => {

    if(result) {
      console.log(result);
      result = {status: "OK", data: result};

      response.json(result);
    }

  });

});


///////// OTHER ENDPOINTS ////////////////////////////////

app.get('/policy', function(request,response) {
  response.sendFile(path.join(__dirname+'/StaticFiles/privacy.html'));
});

app.get('/policy/dark', function(request,response) {
  response.sendFile(path.join(__dirname+'/StaticFiles/privacy_dark.html'));
});

app.get('/about', function(request,response) {
  response.sendFile(path.join(__dirname+'/StaticFiles/about.html'));
});

app.get('/about/dark', function(request,response) {
  response.sendFile(path.join(__dirname+'/StaticFiles/about_dark.html'));
});

const main = () => {

  const command = yargs.argv;

  if(command.https) {

    if(command.https == 'y' || command.https == 'Y') {

      const options = {
        key: fs.readFileSync('/etc/ssl/private/key.pem'),
        cert: fs.readFileSync('/etc/ssl/certs/cert.pem')
      };

      https.createServer(options, app).listen(8000);

      console.log('Running https server on port 8000');

    } else {

      app.listen(3003);
      console.log('Running http server on port 3003');
    }

  } else {

    const options = {
      key: fs.readFileSync('/etc/ssl/private/key.pem'),
      cert: fs.readFileSync('/etc/ssl/certs/cert.pem')
    };

    https.createServer(options, app).listen(8000);

    console.log('Running https server on port 8000');

  }

};

main();
