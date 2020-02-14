

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/themitpost";

const DB = 'themitpost';

const insert_article = function(article, collection) {

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

module.exports.refresh_articles = async (article, collection) => {
  let client = MongoClient.connect(url, {useUnifiedTopology: true}).catch((error) => console.log(error))

  try {

    let collection = client.db(DB).collection(collection)

    let update = { $set: {}}
  }
}

const query_skeleton_article = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');

    database_object.collection(COLLECTION).findOne(query, (error, result) => {

      if(error) return callback(new Error(error));

      let _article = {
                        _id: result._id,
                        title: result.title,
                        featured_media: result.featured_media,
                        author: result.author,
                        date: result.date,
                        message: result.message
                      };

      callback(_article);

    });

    database.close();

  });

};

const query_skeleton_article_all = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');

    database_object.collection("unfiltered").find(query).toArray((error, result) => {

      if(error) return callback(new Error(error));

      var _articles = [];

      for(var i = 0; i < result.length; i += 1) {

        let _article = {
                          _id: result[i]._id,
                          category: result[i].category,
                          title: result[i].title,
                          link: result[i].link,
                          featured_media: result[i].featured_media,
                          author: result[i].author,
                          date: result[i].date,
                          message: result[i].message
                        };

        _articles.push(_article);

      }

      callback(_articles);

    });

    database.close();

  });

};

const query_full_article = function(query, collection, callback) {

  MongoClient.connect(url, (error, database) => {

    if(error) callback(new Error(error));

    var database_object = database.db('themitpost');

    database_object.collection(collection).findOne(query, (error, result) => {

      if(error) reject(error);

       callback(result);

    });

    database.close();
   });

};

module.exports.query_full_article = query_full_article;
module.exports.query_skeleton_article = query_skeleton_article;
module.exports.insert_article = insert_article;
module.exports.query_skeleton_article_all = query_skeleton_article_all;
