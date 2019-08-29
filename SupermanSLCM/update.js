
/*              TODO

1. From the existing registration, password COLLECTION of MongoDB, fetch each user and check SLCM for their updates on slcmMarks, slcmAttendance 
(only once for previous semesters) for any changes. Also check on slcmValues for changes (for iOS).

2. Firstly we will check for differences in encrypted data, if there is invoke the method to check for particular changes

3. If a change is found in any field, trigger a firebase cloud messaging function to send a notification for that user (FCM token)

4. Store the new result


R E P E A T


*/

const axios = require('axios');
const deasync = require('deasync');
const MongoClient = require('mongodb');

const database = require('./database');
const utilities = require('./utilities');

const url = "mongodb://localhost:27017/";



const fetch = (registration, password) => {

  return axios.post('http://localhost:3000/values/update', {regNumber: registration, pass: password}).then(response => {

    return response;

  }).catch(error => {

    console.log(error);
    return null;

  });

}

test_axios('170905022', 'FHJ-CSd-5rc-f5A');


/*while(true) {

  update_all_users();

  deasync.sleep(hours(1));

}*/
