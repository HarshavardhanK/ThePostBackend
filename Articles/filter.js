
const axios = require('axios');
const yargs = require('yargs');

const utilities = require('./utilities.js');
const webView = require('./ArticleWebview/index.js');
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

      '_id': response.data[i].id,
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

const update = async function(number, command) {

  const API2='https://themitpost.com/wp-json/wp/v2/posts?per_page=' + number;
  const RAW_API = 'https://api.themitpost.com/posts/raw/';

  console.log('Please wait while the articles are being fetched and processed..');

  await get_article(API2).then((response) => {

    for(var i = 0; i < response.length; i += 1) {
      /*let article = utilities.prepare_article_JSON(response[i]); */

      if(command.main === 'update') {
        //database.insert_article(article, 'articles');

        webView.getWebArticle(RAW_API + response[i]._id, response[i]._id).then((response) => {

          console.log(response);
          database.insert_article(response, 'webView');

        }).catch((error) => {
          console.log(error);
        });
        
        //database.insert_article(articleWebView, 'webView');

      } 

      if(command.save_raw === 'y' || command.save_raw === 'Y') {
        database.insert_article(response[i], 'unfiltered'); //saving raw articles for webpage purposes
      }

  
    }

  }).catch((error) => {
    console.log(error);
    return false;

  });

  return true;

};


const main = function() {

  let params = yargs.argv;
  let command_ = params._[0];

  let count = params.articles;
  let save_raw = params.save_raw;

  const command = {main: command_, save_raw: save_raw};

  update(count, command);

};

main();

module.exports.update = update;
