
const MongoClient = require('mongodb');
const crypto = require('crypto');

function encrypt(data, password) {

  var key = crypto.createCipher('aes-128-cbc', password);
  var string = key.update(data, 'utf8', 'hex');

  string += key.final('hex');

  return string;

}
var buff = Buffer.from(JSON.stringify({hello:"ho"}));

const encrypted_data = encrypt(buff, 'abc');
console.log(encrypted_data);

function decrypt(data, password) {

  var myKey = crypto.createDecipher('aes-128-cbc', password);
  return myKey.update(data, 'hex', 'utf8') + myKey.final('utf8');

}

console.log("DATA IS\n");
var data = decrypt(encrypted_data, 'abc');
data = JSON.parse(data.toString());
console.log(data);

const url = "mongodb://localhost:27017/";

const COLLECTION = 'slcm';

const get_slcm_data = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    var database_object = database.db('themitpost');

    database_object.collection(COLLECTION).findOne(query, (error, result) => {
      if(error) throw error;

      console.log(query);

      if(query != undefined) {

        console.log('Query successfull');
        console.log(result);
        callback(result);

      } else {

        console.log("Query unsuccessful..");
        callback(undefined);

      }
    });

    database.close();

  });

};

// const query = {_id: "170905022", password: "FHJ-CSd-5rc-f5A"};
//
// get_slcm_data(query, (result) => {
//
//   console.log(query);
//
//   if(result != undefined) {
//     console.log(result);
//     //res.send(result);
//
//   } else {
//
//     console.log("No data found..");
//
//   }
// });
