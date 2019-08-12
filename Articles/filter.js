
const axios = require('axios');

const utilities = require('./utilities.js');
const webView = require('.ArticleWebView/index.js');
const database = require('./database.js');

const API = 'https://themitpost.com/wp-json/wp/v2/posts?per_page=50';
const AUTHOR_API = 'https://themitpost.com/wp-json/wp/v2/users/';

const get_article = async(_API) => {

  try {

    let articles = [];

    let response = await axios.get(_API);

    let num_articles = response.data.length;

    console.log("%s articles encountered", num_articles);

    for(var i = 0; i < num_articles; i += 1) {

      if(response.data[i].title.rendered.indexOf("Playlist") != -1) {
        continue;
      }

      var author_ID = response.data[i].author;
      var author_api = AUTHOR_API + author_ID;

      let author_response = await axios.get(author_api);

      let author = {name: author_response.data.name, url: author_response.data.link};

      article = {

      'id': response.data[i].id,
      'date': response.data[i].date,
      'title': response.data[i].title.rendered,
      'content': response.data[i].content.rendered,
      'featured_media': response.data[i].jetpack_featured_media_url,
      'link': response.data[i].link,
      'author': author,
      'message': response.data[i].meta.jetpack_publicize_message

    };

      articles.push(article);

    }

    return articles;


  } catch(error) {

    console.log("error encountered.. exiting");
    console.log(error);

    return undefined;

  }

};

const update = async function(number) {

  const API2='https://themitpost.com/wp-json/wp/v2/posts?per_page=' + number;

  console.log('Please wait while the articles are being fetched and processed..');

  await get_article(API2).then((response) => {

    for(var i = 0; i < response.length; i += 1) {
      let article = utilities.prepare_article_JSON(response[i]);
      database.insert_article(article);

    }

  }).catch((error) => {
    console.log(error);
    return false;
  });

  return true;

};



const arguments = process.argv.slice(2);
const count = arguments[0];
const needs_update = arguments[1];

if(needs_update == 'y') {
  update(count);
}

module.exports.update = update;
