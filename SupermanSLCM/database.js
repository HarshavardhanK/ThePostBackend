
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/themitpost";


module.exports.insert_slcm_data = async (filter, value, COLLECTION='gen') => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    const database = client.db('themitpost');
    let collection = database.collection(COLLECTION);

    console.log("inserting data");

    console.log(filter);

    let result = await collection.replaceOne(filter, value, {"upsert": true});

  } catch(error) {
    console.log(error);
    return undefined;

  } finally {
    client.close();
  }

}

module.exports.get_slcm_data = async (query, COLLECTION) => {

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    console.log('querying slcm data');

    const database = client.db('themitpost');
    let collection = database.collection(COLLECTION);

    console.log(query);
    return await collection.findOne(query);

  } catch(error) {

    console.log(error);
    return undefined;

  } finally {
    client.close();
  }

}
