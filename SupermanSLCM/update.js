
/*              TODO

1. From the existing registration, password COLLECTION of MongoDB, fetch each user and check SLCM for their updates on slcmMarks, slcmAttendance 
(only once for previous semesters) for any changes. Also check on slcmValues for changes (for iOS).

2. Firstly we will check for differences in encrypted data, if there is invoke the method to check for particular changes

3. If a change is found in any field, trigger a firebase cloud messaging function to send a notification for that user (FCM token)

4. Store the new result


R E P E A T


*/


const axios = require('axios');
const MongoClient = require('mongodb');
const deasync = require('deasync');
const yargs = require('yargs')


const database = require('./database');
const utilities = require('./utilities');
const encrypt = require('./encryption')
const attendance_notif = require('./attendance_notif')

const url = "mongodb://localhost:27017/";

const fetch = async (cred, password, test) => {

  if(cred.registration.length < 9 || cred.password.length <= 0) {
    console.log("Empty piece of shit")
    return
  }

  let URL = 'https://app.themitpost.com/values/update';

  if(test) {
    URL = 'http://localhost:3003/values/update'
    console.log('Sending POST to http')

  } else {
    console.log("Sending POST to https")
  }

  try {

    console.log(cred.registration, password, test)

    let response = await axios.post(URL, {regNumber: cred.registration, pass: password});
    console.log("Recevied response is");
    console.log(response.data)

    if(response.data.message === 'Invalid Credentials') {
      console.log('invalid')
      return false;

    }

    let get_query = {registration: cred.registration, password: password}

    if(test) {
      console.log("Query while fetching is", get_query);
    }

    let current_object = await database.get_slcm_data(get_query, 'ios')

    if(current_object == null) {
      console.log('No SLCM data for user found');

      current_object = utilities.sanitize(response.data)
      let insert_query = {registration: cred.registration, password: password}
      await database.insert_slcm_data(insert_query, response.data, 'ios');

      attendance_notif.attendance_danger(current_object, cred)
      attendance_notif.attendance_awesome(current_object, cred)
        
    } else {

      console.log('Found existing object in database');

      let check = utilities.check(cred, current_object, response.data)

      if(check.change) {

        console.log("Different values in database and recently scraped");

        console.log('Update for user object returned');
        let insert_query = {registration: cred.registration, password: password}

        await database.insert_slcm_data(insert_query, check.value, 'ios');

        attendance_notif.attendance_danger(check.value, cred)
        attendance_notif.attendance_awesome(current_object, cred)

      }

    }

  } catch(error) {
    console.log(error);
    return false;

  }

  return true;

}


const refresh = async (test) => {

  const h_cred = {
    registration: '170905022',
    password: 'FHJ-CSd-5rc-f5A'
  }

  const r_cred = {
    registration: '170905054',
    password: 'tropicofleo110.'
  }

  await fetch(h_cred, h_cred.password , test)
  await fetch(r_cred, r_cred.password, test)

}

//refresh();

const update_all = async (test, sleep_interval=30) => {

  let results = await database.get_all_credentials();

  for(var i = 0; i < results.length; i++) {

    let password = encrypt.decrypt(results[i].password, results[i].registration)
    console.log('Update all %s %s', results[i].registration, password)

    if(await fetch(results[i], password, false)) {

      console.log('Successfully fetched')
      //console.log('Waiting for 5s')
      //deasync.sleep(utilities.seconds(5))

    } else {
      console.log('Error in fetching SLCM data')
    }

  }

  console.log('Done');

}

const main = async () => {

  let params = yargs.argv
  
  let test_ = false

  if(params.test) {

    console.log('test command')

    if(params.test === 'y') {
      test_ = true
      console.log('Running in test mode')
    }

  }

  if(test_) {
    console.log('test is true');
  }
  
  if(params.refresh) {
    console.log('refresh')

    if(params.refresh === 'y') {
      await refresh(test_)
    }

  } else if(params.update_all) {

    console.log('update_all')

    if(params.update_all === 'y') {
      await update_all(test_);
    }

  } else {
    console.log('command not recognized')
    console.log('update.js running update_all: method. Press Ctrl-C to stop');

    while(1) {
      await update_all(test_);
      console.log("Sleeping for 15min")
      deasync.sleep(utilities.minutes(15))
    }
    
  }
  
}

main();

//update_all_the_time();



