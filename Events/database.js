
const Mongo = require('mongodb');
const url = "mongodb://localhost:27017/themitpost";

const COLLECTION = 'events';

module.exports.insert_event = function(event, callback) {

  Mongo.connect(url, (error, database) => {

    if(error) throw error;

    const databaseObject = database.db('themitpost');

    var strDate = event.date + " " + event.time;
    var timestamp = Date.parse(strDate);
    //console.log(timestamp);
    event.timestamp = timestamp;

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

 module.exports.get_event_all = () => {

  return Mongo.connect(url) .then(database => {

    const databaseObject = database.db('themitpost');

     return databaseObject.collection(COLLECTION).find().sort({timestamp: 1}).toArray().then(result => {

      console.log(result)
      database.close();
      return result

     })
     .catch(err => {
       throw err
     }) 

  })
  .catch(err => {
    database.close()
    throw err
  });

};


