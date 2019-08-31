
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

const fetch = async (registration, password) => {

  try {

    let response = await axios.post('http://localhost:3000/values/update', {regNumber: registration, pass: password});

    if(response.message === 'BAD') {
      console.log('invalid')
      return false;``

    }

    let get_query = {registration: registration, password: password}

    console.log("Query while fetching is", get_query);
   
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
        console.log('New attendance object returned');

        let new_object = current_object;
        new_object.academicDetails[0].attendance = newValue;

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


const refresh = async () => {

  await fetch('170905022', 'FHJ-CSd-5rc-f5A')
  await fetch('170905054', 'tropicofleo110.')

}

//refresh();

const update_all = async (sleep_interval=30) => {

  let results = await database.get_all_credentials();

  for(var i = 0; i < results.length; i++) {
    let password = encrypt.decrypt(results[i].password, results[i].registration)

    await fetch(results[i].registration, password);
  }

  console.log('Done');

}

//update_all();

const update_all_the_time = async () => {

  while(true) {
    //console.log('hello')
    await update_all(10);
  }

}

const main = () => {

  let params = yargs.argv
  
  let refresh_ = params.refresh
  let update_all_ = params.update_all;

  if(refresh_ === 'y') {
    refresh()
  }

  if(update_all_ === 'y') {
    update_all();
  }


}

main();

//update_all_the_time();



