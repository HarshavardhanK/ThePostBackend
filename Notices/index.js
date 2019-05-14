const express = require('express');
const path = require('path');
const app = express();

const database = require('./database.js');

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/Notices/static/initial.html'));
});


//////

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

  database.insert_notice(notice);

  response.send("<h1> NOTICE INSERTED </h1>");

});

app.get('/notices', function(request, response) {

  database.get_notices_all(result => {

    if(result) {
      console.log(result);
      result = {status: "OK", data: result};

      response.json(result);
    }

  });

});

app.listen(8080);
