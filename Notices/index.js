
const path = require('path');
const FCM = require('fcm-node');


//Required to authenticate to FCM
const server_key = "AAAAG-SAMsE:APA91bHO8utPUH9yrRyJA37KlCSUiUg44NdyQicqJCbdk0f5oJ9eh4Rfew8uuGsnEyd_EZtcanzB7ecqL6E83wOZqfm_B3KSo4Kw1mu_8phDZJ5HM6i9TPX6k-gjBmmJquWU1zh82fKT";

//This topic receives notifications regarding notices
const topic = "/topics/notice";

var fcm = new FCM(server_key);

const database = require('./database.js');

//RAKSHIT USE THE FUNCTION BELOW FOR YOUR PURPOSES I SUPPOSE

module.exports.get_base_for_notice = () => {

  const express = require('express');
  const notice_app = express();

  const bodyParser = require('body-parser');

  notice_app.use(bodyParser.urlencoded({ extended: false }));
  notice_app.use(bodyParser.json());

  notice_app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/static/initial.html'));
  });

}



module.exports.notices_post = (app) => {

  app.post('/portal/notices/submitted', function(request, response) {

    const title = request.body.title;
    const content = request.body.content;
    const date = request.body.date;
    const time = request.body.time;
  
    //Grab the value of the checkbox "notify?"
    const notify = request.body.notify;
  
    var message = {
      to: topic,
      notification: {
        title: title,
        body:content
      }
    };
  
    if(notify === 'on'){
  
      //If notify checkbox is checked then send notification
  
      fcm.send(message, function(err, response){
        if (err) {
            console.log(err);
        }
        else {
            console.log("Successfully sent with response: ", response);
        }
      });
    }
  
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

}




// app.get('/notices', function(request, response) {

//   database.get_notices_all(result => {

//     if(result) {
//       console.log(result);
//       result = {status: "OK", data: result};

//       response.json(result);
//     }

//   });

// });

