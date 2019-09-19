
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

const url = "mongodb://localhost:27017/";

const fetch = async (registration, password, test) => {

  let URL = 'https://app.themitpost.com/values/update';

  if(test) {
    URL = 'http://localhost:3003/values/update'
    console.log('Sending POST to http')

  } else {
    console.log("Sending POST to https")
  }

  try {

    let response = await axios.post(URL, {regNumber: registration, pass: password});

    console.log(response.data)

    if(response.data.message === 'Invalid Credentials') {
      console.log('invalid')
      return false;``

    }

    let get_query = {registration: registration, password: password}

    if(test) {
      console.log("Query while fetching is", get_query);
    }

    let current_object = await database.get_slcm_data(get_query, 'ios')

    if(!current_object) {
      console.log('No SLCM data for user found');

      let insert_query = {registration: registration, password: password}
      await database.insert_slcm_data(insert_query, response.data, 'ios');
        
    } else {

      console.log('Found existing object in database');

      let check = utilities.check(current_object, response.data)

      if(check.change) {

        console.log("Different values in database and recently scraped");

        let newValue = check.value;
        console.log('Update for user object returned');

        let new_object = newValue;;
      
        let insert_query = {registration: registration, password: password}

        await database.insert_slcm_data(insert_query, new_object, 'ios');

      }

    }


  } catch(error) {
    console.log(error);
    return false;

  }

  return true;

}


const refresh = async (test) => {

  await fetch('170905022', 'FHJ-CSd-5rc-f5A', test)
  await fetch('170905054', 'tropicofleo110.', test)

}

//refresh();

const update_all = async (test, sleep_interval=30) => {

  let results = await database.get_all_credentials();

  for(var i = 0; i < results.length; i++) {
    let password = encrypt.decrypt(results[i].password, results[i].registration)

    if(await fetch(results[i].registration, password, test)) {

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

    await update_all(test_);
    
  }
  
}

main();

//update_all_the_time();



