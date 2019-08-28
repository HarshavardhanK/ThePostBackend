
/*              TODO

1. From the existing registration, password COLLECTION of MongoDB, fetch each user and check SLCM for their updates on slcmMarks, slcmAttendance 
(only once for previous semesters) for any changes. Also check on slcmValues for changes (for iOS).

2. Firstly we will check for differences in encrypted data, if there is invoke the method to check for particular changes

3. If a change is found in any field, trigger a firebase cloud messaging function to send a notification for that user (FCM token)

4. Store the new result


R E P E A T


*/


const scraper = require('./modules/helper');
const database = require('./database');

const crypto = require('crypto');
const deasync = require('deasync');

const MongoClient = require('mongodb');


// MARK:- SPECIFIC UTILITIES FOR TIME CONVERSIONS

const seconds = function(seconds) {
  return seconds * 1000;
};

const minutes = function(minutes) {
  return 1000 * 60 * minutes;
};

const hours = function(hours) {
  return 1000 * 60 * 60 * hours;
};

const days = function(days) {
  return 1000 * 60 * 60 * 24 * days;
};


const url = "mongodb://localhost:27017/";


while(true) {

  update_all_users();

  deasync.sleep(hours(1));

}
