
const Mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const COLLECTION = 'notices';

const insert_notice = function(notice) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).save(notice, (error, result) => {

      if(error) {
        throw error;
      }

      console.log("Notice inserted");
    });
    database.close();

  });
};

const get_notices_all = function(callback) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).find({}).toArray((error, result) => {

      if(result) {

        var notices = [];

        result.forEach(function(res) {
          notices.push(res);

        });

        console.log('Obtained all notices');
        callback(notices);
      }

    });

    database.close();
  });
}

module.exports.get_notices_all = get_notices_all;
module.exports.insert_notice = insert_notice;
