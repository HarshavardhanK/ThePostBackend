
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/themitpost";

const COLLECTION = 'slcm';

const insert_slcm_data = function(value) {

  MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');

    database_object.collection(COLLECTION).save(value, (error, result) => {
      console.log("SLCM insert insert succesfull");
    });

    database.close();

  });

};

const get_slcm_data = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    var database_object = database.db('themitpost');

    database_object.collection(COLLECTION).findOne(query, (error, result) => {
      if(error) throw error;

      console.log(query);

      if(query != undefined) {

        console.log('Query for SLCM data successfull');
        //console.log(result);
        callback(result);

      } else {

        console.log("Query for SLCM data unsuccessful..");
        callback(undefined);

      }
    });

    database.close();

  });

};


module.exports.insert_slcm_data = insert_slcm_data;
module.exports.get_slcm_data = get_slcm_data;
