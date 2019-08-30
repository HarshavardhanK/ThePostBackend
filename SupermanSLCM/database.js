
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/themitpost";

const encrypt = require('./encryption');


module.exports.insert_slcm_data = async (filter, value, COLLECTION='gen') => {

  console.log("Calling MongoDB insert method")

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

    console.log('Inserting data into %s collection', COLLECTION);

    console.log('cred before encrypt insert');

    //console.log(filter);

    let password = encrypt.encrypt(filter.password, filter.registration);
    filter.password = password;

    let data = JSON.stringify(value);
    data = encrypt.encrypt(data, password);

    let encrypted_value = {registration: filter.registration, password: filter.password, semester: filter.semester, data: data};

    console.log(encrypted_value);

    const database = client.db('themitpost');
    let collection = database.collection(COLLECTION);

    console.log("inserting data in %s collection", COLLECTION);

    console.log(filter);

    let result = await collection.updateOne(filter, {$set: {data: encrypted_value.data}}, {upsert: true});

  } catch(error) {
    console.log(error);
    return undefined;

  } finally {
    client.close();
  }

}

module.exports.get_slcm_data = async (filter, COLLECTION) => {

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => {console.log(error)});

  if(!client) {
    return undefined;
  }

  try {

   // console.log(filter);

    let password = encrypt.encrypt(filter.password, filter.registration);
    filter.password = password;

    console.log('querying slcm data in %s collection', COLLECTION);

    const database = client.db('themitpost');
    let collection = database.collection(COLLECTION);

    console.log(filter);
    let result = await collection.findOne(filter);

    if(result) {

      console.log('found!');
      result = encrypt.decrypt(result.data, filter.password);

      return JSON.parse(result.toString());

    } else {
      console.log('No SLCM data retrieved');
      return null;

    }

  } catch(error) {

    console.log(error);
    return undefined;

  } finally {
    client.close();
  }

}

module.exports.insert_response = async (filter, response) => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => console.log(error));

  if(!client) {
    console.log('No MongoClient found');
    return null;
  }

  let password = encrypt.encrypt(filter.password, filter.registration);
  filter.password = password;

  await client.db('themitpost').collection('response').replaceOne(filter, response);
}

const test_cursor = async (COLLECTION) => {

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => console.log(error));

  if(!client) {
    return null;
  }

  let collection = client.db('themitpost').collection(COLLECTION);

  collection.find().forEach(function(document) {
    console.log(document.registration, document.password);
  });

  client.close();

}
//test_cursor('ios');