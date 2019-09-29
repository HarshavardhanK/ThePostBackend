// const express = require('express');
// const path = require('path');
// const app = express();

const database = require('./database.js');

// app.get('/portal/events',function(req,res){
//   res.sendFile(path.join(__dirname+'/static/initial.html'));
// });



// ////// GET VALUES FROM PORTAL /////////////////

// const bodyParser = require('body-parser');


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


module.exports.post_events = (app) => {

  app.post('/portal/events/submitted', function(request, response) {

    const club = request.body.club;
    const title = request.body.title;
    const content = request.body.content;
    const imageURL = request.body.imageURL;
    const date = request.body.date;
    const time = request.body.time;
    const location = request.body.location;
    const formLink = request.body.formLink;
  
    if(formLink.trim() == ""){
      formLink = "NA";
    }
  
    const event = {
      clubName: club,
      title: title,
      content: content,
      imageURL: imageURL,
      date: date,
      time: time,
      formLink: formLink,
      location: location
    };
  
    database.insert_event(event, error => {
  
      if(error) {
        throw (error);
      }
    });
  
    response.send("<h1>EVENT INSERTED<h1>");
  
  
  });

}

module.exports.get_events = (app) => {

  app.get('/events', function(request, response) {

    database.get_event_all({}, result => {
  
      if(result) {
        result = {status: 'OK', data: result};
        response.json(result);
  
      } else {
        console.log('Nothing found..');
      }
  
    });
  
  });

}





// app.listen(8080);
