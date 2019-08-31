

const deasync = require('deasync');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/themitpost";

const encrypt = require('./encryption');
const utilities = require('./utilities');


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

const update_for_each_cursor_function = async (document, update) => {

  if(document) {

    if(document.registration) {
      //enough to check if its a valid SLCM document

      let password = encrypt.decrypt(document.password, document.registration);

      if(!await update(document.registration, password)){
        console.log("error in updating document");
        return false;
      }

      return truei

    }
  }
}

module.exports.update_for_each = async (update) => {

  const client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => console.log(error));

  if(!client) {
    console.log("Error creating client");
    
  } else {

    try {

      let collection = client.db('themitpost').collection('ios');

      return await collection.find().forEach(await update_for_each_cursor_function(document, update));

    } catch(error) {

      console.log(error);
      return false;

    } finally {
      console.log('Closing clietnt')
      client.close();
    }

  }

}

//fetches documents sequentially from the collection

module.exports.next_document = async () => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => console.log(error));

  if(!client) {
    return false;
  }

  let collection = client.db('themitpost').collection('ios');

  try {

    return await collection.find().next(function (document) {

      console.log('fetching the next document');

      if(document) {
        let result = {registration: document.registration, password: encrypt.decrypt(document.password, document.registration)}
        console.log(result)
        return result;
  
      }
  
      return false;
  
    });

  } catch(error) {
    return false;
  }

  
}
//test_cursor('ios');