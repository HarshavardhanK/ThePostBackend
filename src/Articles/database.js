

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/themitpost";

const DB = 'themitpost';

exports.insert_article = function(article, collection) {

  console.log("Saving in %s collection", collection);

  MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');
    database_object.collection(collection).save(article, {ordered: true}, (error, result) => {
      console.log('Article insert successful');
    });
    database.close();

  });
};

module.exports.bulk_insert_articles = async (articles) => {
  let client = await MongoClient.connect(url, {useUnifiedTopology: true}).catch((error) => console.log(error))

  try {

    let collection = client.db(DB).collection('unfiltered')

    await collection.insertMany(articles)

    console.log("Succesfully inserted all articles")
    
  } catch(error) {
    console.log(error)

  } finally {
    client.close()
  }
}

module.exports.posts = async () => {

  let client = await MongoClient.connect(url, {useUnifiedTopology: true}).catch((error) => console.log(error))

  try {

    let collection = client.db(DB).collection('unfiltered')

    return await collection.find({}).project({content: 0}).sort({timestamp: -1}).toArray()

  } catch(error) {
    console.log(error)

  } finally {
    client.close()
  }

}


exports.query_full_article = function(query, collection, callback) {

  MongoClient.connect(url, {useUnifiedTopology: true}, (error, database) => {

    if(error) callback(new Error(error));

    var database_object = database.db('themitpost');

    database_object.collection(collection).findOne(query, (error, result) => {

      if(error) reject(error);

       callback(result);

    });

    database.close();
   });

};

