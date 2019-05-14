
const Mongo = require('mongodb');
const url = "mongodb://mongo:27017/themitpost";

const COLLECTION = 'events';

const insert_event = function(event, callback) {

  Mongo.connect(url, (error, database) => {

    if(error) throw error;

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).save(event, (error, result) => {

      if(error) {
        callback(Error(error));
        console.log(error);
      }

      console.log('Event inserted.');
    });
    database.close();

  });


};

 const get_event = function(event, callback) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).findOne(event, (error, result) => {

      if(error) throw error;

      if(result) {
        callback(result);
        console.log('Event succesfullly retrieved');

      } else {
        console.log('No such event found..');
      }

    });

    database.close();

  });
}

 const get_event_all = function(event, callback) {

  Mongo.connect(url, (error, database) => {

    const databaseObject = database.db('themitpost');

    databaseObject.collection(COLLECTION).find({}).toArray((error, result) => {

      if(error) throw error;

      if(result) {

        var events = [];
        console.log(result);

        result.forEach(function(res) {
          events.push(res);
        });

        console.log(events);

        callback(events);

        console.log('Event succesfullly retrieved');

      } else {
        console.log('No such event found..');
      }

    });

    database.close();

  });
};

module.exports.insert_event = insert_event;
module.exports.get_event = get_event;
module.exports.get_event_all = get_event_all;
