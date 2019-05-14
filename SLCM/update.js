const scraper = require('./scraper.js');
const database = require('./database.js');

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

const get_registration_password_dictionary = function(callback) {

  MongoClient.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection('slcm').find({}).toArray((error, result) => {

      if (error) throw error;

      if(result != undefined) {

        const value = [];
        //console.log(result);
        console.log('Found %d values', result.length);

        result.forEach(function(res) {
          value.push({registration: res._id, password: res.password});

        });

        console.log('Done getting all credentials..');


        callback(value);

      } else {
        console.log('Database empty..');
        callback(undefined);

      }

    });

    database.close();



  });

  console.log('Got all values');

};

function decrypt(data, password) {

  var myKey = crypto.createDecipher('aes-128-cbc', password);
  return myKey.update(data, 'hex', 'utf8') + myKey.final('utf8');

}

function encrypt(data, password) {

  var key = crypto.createCipher('aes-128-cbc', password);
  var string = key.update(data, 'utf8', 'hex');

  string += key.final('hex');

  return string;

}

const compare_to_present = function(registration, password, data) {

  //password = decrypt(password, registration);

  database.get_slcm_data({_id: registration, password: password}, value => {

    if(value) {

      if(data == value.data) {
        return true;

      } else {
        return false;
      }

    }

    console.log('No data found..');

    return false;

  });

};

const update_all_users = function() {

  get_registration_password_dictionary(value => {
    //console.log(value);

    value.forEach(function(results) {

      var browser = true;

      const registration = results.registration;
      console.log('Checking updates for %s', registration);
      const password = decrypt(results.password, registration);

      scraper.scrape_data(registration, password, (error, value) => {

        if(error) {
          console.log(error);
        }

        browser = false;

        var data = Buffer.from(JSON.stringify(value));

        data = encrypt(data, password);

        if(compare_to_present(registration, results.password, data)) {

          const result = {_id: registration, password: results.password,  data: data};

          console.log('Data has changed..');
          database.insert_slcm_data(result);

        } else {
          console.log('Data has not changed..');
        }

        console.log('Update complete');

      });

      while(browser) {deasync.sleep(1000);}

    });

    //isComplete(true);

  });

};

while(true) {

  update_all_users();

  deasync.sleep(hours(1));

}
