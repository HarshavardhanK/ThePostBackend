
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017/themitpost";

const COLLECTION = 'slcm';
const RESPONSE_COLLECTION = 'response';

module.exports.insert_slcm_data = (value) => {

  return MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');

    database_object.collection(COLLECTION).save(value, (error, result) => {
      console.log("SLCM insert insert succesfull");
    });

    database.close();

    return true;

  });

};

module.exports.insert_response = (registration, value) => {

  let query = {_id: registration, response: value};
  console.log(query);

  MongoClient.connect(url, (error, database) => {

    if(error) {
      console.log(error);
      throw error;
    }

    var database_object = database.db('themitpost');

    database_object.collection(RESPONSE_COLLECTION).updateOne(query, (error, result) => {
      console.log('response updated');
    })

    database.close();

  })
}

module.exports.get_slcm_data = (query) => {

  return MongoClient.connect(url, (error, database) => {

    var database_object = database.db('themitpost');

    return database_object.collection(COLLECTION).findOne(query, (error, result) => {

      if(error) throw error;

      console.log(query);

      if(query != undefined) {

        console.log('Query for SLCM data successfull');

        database.close();

        return result;

      } else {

        console.log("Query for SLCM data unsuccessful..");

        database.close();

        return undefined;

      }
    });

  });

};

