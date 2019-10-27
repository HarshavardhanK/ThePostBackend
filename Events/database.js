
const Mongo = require('mongodb');
const url = "mongodb://localhost:27017/themitpost";

const COLLECTION = 'events';

/*module.exports.insert_event = function(event, callback) {

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

};*/

module.exports.insert_event = (event) => {

  return Mongo.connect(url)
  .then(database => {

    let databaseObject = database.db('themitpost')

    var strDate = event.date + " " + event.time;
    var timestamp = Date.parse(strDate);
    event.timestamp = timestamp;
    
    let query = {clubName: event.clubName, title: event.title};
    let update = {$set: {clubName: event.clubName, title: event.title, content: event.content, imageURL: event.imageURL,
                          date: event.date, time: event.time, formLink: event.formLink, location: event.location, timestamp: event.timestamp}}

    return databaseObject.collection(COLLECTION).updateOne(query, update, {upsert: true}).then(response => {
      console.log("event inserted")
      
    })
    .catch(error => {
      console.log("error events insert")
    })

  })
  .catch(error => {
    throw new Error("Cannot be fetched")
  })

}

 module.exports.get_event_all = () => {

  return Mongo.connect(url) .then(database => {

    const databaseObject = database.db('themitpost');

     return databaseObject.collection(COLLECTION).find().toArray().then(result => {

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


