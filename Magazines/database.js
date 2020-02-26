
const Mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const COLLECTION = 'magazines';

const insert_magazine = function(magazine) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).save(magazine, (error, result) => {

      if(error) {
        throw error;
      }

      console.log("Magazine inserted");
    });
    database.close();

  });
};

const get_magazines_all = function(callback) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).find({}).toArray((error, result) => {

      if(result) {

        var magazines = [];

        result.forEach(function(res) {
          magazines.push(res);

        });

        console.log('Obtained all magazines');
        callback(magazines);
      }

    });

    database.close();
  });
}

module.exports.get_magazines_all = get_magazines_all;
module.exports.insert_magazine = insert_magazine;
