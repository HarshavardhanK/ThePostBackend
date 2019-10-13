

const deasync = require('deasync');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017/themitpost";

const encrypt = require('./encryption');
const utilities = require('./utilities');

module.exports.insert_credentials = async (value) => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true}).catch(error => console.log(error))

  if(!client) {
    return;
  }

  try {

    console.log('Inserting credentials')

    let collection = client.db('themitpost').collection('credentials')
    console.log(value)

    value.password = encrypt.encrypt(value.password, value.registration);

    console.log('inserting this credentials')

    console.log(value)

    //await collection.insertOne(value);
    let query = {_id: value._id, registration: value.registration, password: value.password}
    let update = {$set: {_id: value._id, registration: value.registration, password: value.password, token: value.token, status: value.status}}

    collection.insertOne(query)

    collection.updateOne(query, update, function(error, response) {
      if(error) {
        console.log(error)
        throw error
      }

      console.log("credentials updated with");
      console.log(update)

    })
    
    console.log('saved credentials')

  } catch(error) {
    console.log(error)

  } finally {
    client.close()
  }

}


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
    //console.log(filter)

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

module.exports.get_all_credentials = async () => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true})

  if(!client) {
    return false;
  }

  try {

    let collection = client.db('themitpost').collection('credentials');

    let all_docs = await collection.find().toArray();

    return all_docs;

  } catch(error) {
    return null;

  } finally {
    client.close();
  }

  
}

module.exports.get_credential = async (registration) => {

  let client = await MongoClient.connect(url, {useNewUrlParser: true})

  if(!client) {
    return false;
  }

  try {

    let collection = client.db('themitpost').collection('credentials');

    let data = await collection.findOne({registration: registration});

    return data;

  } catch(error) {
    console.log(error)
    return null

  } finally {
    client.close();
  }

}
