
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/themitpost";

const COLLECTION = 'slcm';
const RESPONSE_COLLECTION = 'response';

module.exports.insert_slcm_data = async (registration, value) => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    const database = client.db('themitpost');
    let collection = database.collection('slcm');

    let query = {_id: registration};

    let result = await collection.replaceOne(query, value, {"upsert": true});

  } catch(error) {
    console.log(error);
    return undefined;

  } finally {
    client.close();
  }

};

module.exports.insert_credentials = async (registraion, password) => {

  let client = await MongoClient.connect(url ,{useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return;
  }

  try {

    const database = client.db('themitpost');
    let collection = database.collection('slcm');

    value = {_id: registration, password: password};

    let result = await collection.insertOne(value);

  } catch(error) {
    console.log(error);
    return undefined;

  } finally {
    client.close();

  }
}

module.exports.insert_response = async (registration, value) => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    const database = client.db('themitpost');
    let collection = database.collection(RESPONSE_COLLECTION);

    let query = {_id: registration};

    let result = await collection.updateOne(query, value, {upsert: true});

  } catch(error) {
    console.log(error);
    return undefined;

  } finally {
    client.close();
  }
}

module.exports.get_response = async (registraion) => {

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {
    console.log(error);
  });

  if(!client) {
    return undefined;
  }

  try {

    const database = client.db('themitpost');
    let collection = database.collection(RESPONSE_COLLECTION);

    let query = {_id: registraion};

    console.log('queried response');

    let result = await collection.findOne(query);

    console.log(result);

    return result;

  } catch(error) {

    console.error(error);
    return undefined;

  } finally {

    client.close();
  }
    
}

module.exports.get_slcm_ios_data = async (registration, password) => {
  //encrypt and store the password

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    console.log('querying slcm data');

    const database = client.db('themitpost');
    let collection = database.collection('slcm');

    let query = {_id: registration};

    console.log(query);

    return await collection.findOne(query);

  } catch(error) {

    console.log(error);
    return undefined;

  } finally {
    client.close();
  }
}

