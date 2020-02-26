const express = require('express');
const path = require('path');
const FCM = require('fcm-node');
const app = express();

//Required to authenticate to FCM
const server_key = "AAAAG-SAMsE:APA91bHO8utPUH9yrRyJA37KlCSUiUg44NdyQicqJCbdk0f5oJ9eh4Rfew8uuGsnEyd_EZtcanzB7ecqL6E83wOZqfm_B3KSo4Kw1mu_8phDZJ5HM6i9TPX6k-gjBmmJquWU1zh82fKT";

const topic = "/magazine";

var fcm = new FCM(server_key);

const database = require('./database.js');

module.exports.magazines_post = (app) => {

  app.post('/portal/magazines/submitted', function(request, response) {

    console.log(request.body);

    const title = request.body.title;
    const content = request.body.content;
    const date = request.body.date;
    const pdfLink = request.body.pdfLink;
    const imageLink = request.body.imageURL;
    const passcode = request.body.pass;

    //Grab the value of the checkbox "notify?"
    const notify = request.body.notify;

    if(passcode != 'bdg%C&Qu/ed@4WHv'){
      response.send('Magazine NOT inserted. Check back all details.');
    }
    else{

      const magazine = {
        title: title,
        content: content,
        date: date,
        imageLink:imageLink,
        pdfLink: pdfLink
      };

      var message = {
        to: topic,
        notification: {
          title: title,
          body:content,
          image: imageLink,
          //type of message should not be mixed with its data contents
          type: topic
        },
        data : {
          isNotice: true,
            internalData : {
                title: title,
                content: content,
                date: date,
                time: time,
                imageLink:imageLink,
                pdfLink: pdfLink
            }
        }
      };

      console.log(notify);

      if(notify == 'on'){

        //If notify checkbox is checked then send notification

        console.log("Attempting to send notification");

        fcm.send(message, function(err, response){
          if (err) {
              console.log(err);
          }
          else {
              console.log("Successfully sent with response: ", response);
          }
        });
      }

      database.insert_magazine(magazine);

      response.send('<h1>This magazine has been added. Thank you!</h1><p>&copy The MIT Post 2019. All rights reserved.</p>');
    }

    });
}
