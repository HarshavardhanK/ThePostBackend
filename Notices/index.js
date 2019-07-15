const express = require('express');
const path = require('path');
const app = express();

const database = require('./database.js');

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/static/initial.html'));
});

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/portal/notices/submitted', function(request, response) {

  const title = request.body.title;
  const content = request.body.content;
  const date = request.body.date;
  const time = request.body.time;

  const imagesTemp = request.body.imageURL;

  var images = [];

  for(var i=0;i<imagesTemp.length;i++) {

    var element = imagesTemp[i];

    if(element != null && element != '')
      images.push(element);
  }

  const numImages = images.length;

  const notice = {
    title: title,
    content: content,
    date: date,
    time: time,
    numImages:numImages,
    images:images
  };

  database.insert_notice(notice);

  response.send('<h1>This notice has been added. Thank you!</h1><p>&copy The MIT Post 2019. All rights reserved.</p>');

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
