


/*

CREATED ON 1 MARCH 2019
AUTHOR: HARSHAVARDHAN K aka Tsarshah
EMAIL: tsarshah@gmail.com

The code should not be used anywhere without the express permission of the author

ALL RIGHTS RESERVED


*/

const Promise = require('promise');

const axios = require('axios');
const striptags = require('striptags');
const get_urls = require('get-urls');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

const express = require('express');


const API = 'https://themitpost.com/wp-json/wp/v2/posts/';
const AUTHOR_API = 'https://themitpost.com/wp-json/wp/v2/users/';

const get_article = async(API) => {

  try {

    let articles = [];

    let response = await axios.get(API);

    let num_articles = response.data.length;

    console.log("%s articles encountered", num_articles);

    for(var i = 0; i < num_articles; i += 1) {

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
      'author': author

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

// Get all occurences of a substring

const get_substring_indices = function(str, subStr) {

  const subStrlen = subStr.length;
  const strLen = str.length;

  if(str.length == 0) {
    return [];
  }

  let startIndex = 0;
  let indices = [];

  var indexOf = 0;

  while(indexOf != -1) {

    indexOf = str.indexOf(subStr, startIndex);

    if(indexOf != -1) {
      indices.push(indexOf);
      startIndex = indexOf + subStrlen;
    }

  }

  return indices;

};

const string_window = function(string, start_index, window_size) {

  return string.substr(start_index, window_size);

};

// This function extracts urls eithin a certain window in the passed string
// Ideal winfow size should be 100. Anything more than that will catch the next URLS


const scan_extract_image_urls = function(indices, body) {

  let urls = [];
  let url_object;

  for(var i = 0; i < indices.length; i++) {

    var url = string_window(body, indices[i], 100);
    url = Array.from(get_urls(url)); //get_urls return a set

    key = indices[i];

    url_object = {'url' : url[0], index: key};

    urls.push(url_object);


  }

  return urls;

};

/*
compare_urls function aims to solve the following problem:

I will the take 1st image URL since I know its an original image, and the URL is also shorter in length
Compare that URL with the ones below only for the length of the first URL. If there is a match, then
the image below is a lesser quality version URL.
*/

const group_urls = function(urls) {

  console.log(urls.length);

  var grouped_urls = [];
  var parent_group = [];
  var rank = 0;

  let jpg_index = urls[0].url.indexOf('.jpg');
  let parent_url = urls[0].url.substr(0, jpg_index + 4);

  grouped_urls[0] = [];

  for(var i = 0; i < urls.length; i += 1) {

    if(urls[i].url.indexOf(parent_url) != -1) {

      url_ordering = {url: urls[i].url, index: urls[i].index, rank: rank};
      grouped_urls[rank].push(url_ordering);

    } else {

      rank += 1;

      grouped_urls[rank] = [];

      jpg_index = urls[i].url.indexOf('.jpg');
      parent_url = urls[i].url.substr(0, jpg_index + 4);

      i -= 1;
      parent_group = [];

    }

  }

  console.log("%d parent images encountered", grouped_urls.length);

  return grouped_urls;

};


const get_paragraph_begin_end_indices = function(body) {

  let begin_indices = get_substring_indices(body, "<p");
  let end_indices = get_substring_indices(body, "</p");

  return {begin: begin_indices, end: end_indices};

};

const make_paragraph_array = function(body) {

  let indices = get_paragraph_begin_end_indices(body);

  let begin_indices = indices.begin;
  let end_indices = indices.end;

  var paragraph_array = [];

  for(var i = 0; i < begin_indices.length; i += 1) {

    var content = striptags(body.substring(begin_indices[i], end_indices[i]));

    paragraph = { content: content,
      begin_index: begin_indices[i],
      end_index: end_indices[i] };

      paragraph_array.push(paragraph);

  }
  //console.log(parsed);

  return paragraph_array;

};

// TODO: Align paragraphs and image URLS into a single list of JSON paragraph objects..

const merge_images_paragraphs = function(grouped_urls, paragraph_array) {

  var final_object = [];

  var url_iter = 0;
  var para_iter = 0;

  const grouped_urls_length = grouped_urls.length;
  const paragraph_array_length = paragraph_array.length;

  var url =  grouped_urls[url_iter];
  var paragraph = paragraph_array[para_iter];

  while(url_iter < grouped_urls_length && para_iter < paragraph_array_length) {

    url =  grouped_urls[url_iter];
    paragraph = paragraph_array[para_iter];

    //console.log("URL is %s", url[0].url);

    if(grouped_urls[url_iter][0].index < paragraph_array[para_iter].begin_index) {
      //console.log("URL index is %d", url[0].index);
      content = {content: url[0].url, isUrl: true};
      final_object.push(content);
      url_iter += 1;

    } else {

      if(paragraph.content != '') {
        content = {content: paragraph.content, isUrl: false};
        final_object.push(content);
      }

      para_iter += 1;
    }

  }

    while(para_iter < paragraph_array_length) {
      content = {content: paragraph.content, isUrl: false};
      final_object.push(content);
      para_iter += 1;

    }

    while(url_iter < grouped_urls_length) {
      content = {content: url[0].url, isUrl: true};
      final_object.push(content);
      url_iter += 1;
    }

    return final_object;

};


/*
Replace character encoding difference

For eg. ' is encoded as &#8217;

*/

/* EVERY PARAGRAPH ENTRY MUST HAVE THESE FOLLOWING ATTRIBUTES

sample entry of a paragraph in the list of JSON object

{string: "...some string",
isURL: false,
isBold: false,
isEmpahsied: false,
index: 800}

The index is taken off the filtered string, stripped off all HTML entities

sample entry of an URL in list of JSON object

{string: 'https://themitpost.com/uploads/blah/blah/blah',
isURL: true,
isHyperlink: false,
isBold: false,
isEmpahsied: false,
index: 934};

*/

// TODO: Format the database
const get_date = function(date) {

  if(date.length != 19) {
    console.log('Date not proper');
    return undefined;
  }

  const month_dictionary = {'01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05':
  'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sept', '10': 'Oct', '11': 'Nov', '12': 'Dec'};

  let year = date.substring(0, 4);

  let month = month_dictionary[date.substring(5, 7)];

  let day = date.substring(8, 10);

  if(day[0] === '0') {
    day = day[1];
  }

  return {
    year: year,
    month: month,
    day: day
  };

};

const prepare_article_JSON = function(article) {

  let body = article.content;
  let date = get_date(article.date);
  let title = article.title;
  let id = article.id;
  let link = article.link;
  let featured_media = article.featured_media;

  let image_indices = get_substring_indices(body, "https");
  let urls = scan_extract_image_urls(image_indices, body);
  let grouped_urls = group_urls(urls);

  let paragraph_array = make_paragraph_array(body);

  let filtered_content = merge_images_paragraphs(grouped_urls, paragraph_array);

  var article_JSON =
                     {
                        _id: id,
                        title: title,
                        date: date,
                        featured_media: featured_media,
                        content: filtered_content,
                        link: link,
                        author: article.author

                      };

  return article_JSON;

};

const insert_article = function(article) {

  MongoClient.connect(url, (error, database) => {

    var database_object = database.db('themitpost');
    database_object.collection('articles').insertOne(article, (error, result) => {
      console.log('Article insert successful');
    });
    database.close();

  });
};

const query_skeleton_article = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    if(error) throw error;

    var database_object = database.db('themitpost');

    database_object.collection('articles').findOne(query, (error, result) => {

      if(error) return callback(new Error(error));

      let _article = {
                        _id: result._id,
                        title: result.title,
                        featured_media: result.featured_media,
                        author: result.author,
                        date: result.date
                      };

      callback(_article);

    });

    database.close();

  });

};

const query_full_article = function(query, callback) {

  MongoClient.connect(url, (error, database) => {

    if(error) callback(new Error(error));

    var database_object = database.db('themitpost');

    database_object.collection('articles').findOne(query, (error, result) => {

      if(error) reject(error);

      let _article = {
                        _id: result._id,
                        title: result.title,
                        date: result.date,
                        featured_media: result.featured_media,
                        content: result.content,
                        link: result.link,
                        author: result.author
                      };

       callback(_article);

    });

    database.close();
   });


};

var app = express();

app.get('/posts/:tagId', (request, response) => {

  query = {_id: parseInt(request.params.tagId)};
  //console.log(query);

  query_full_article(query, (data) => {

    if(j=data) {
      console.log('Query successful')
      response.json(data);

    } else {
      response.json({status: 'BAD' , data: []});
    }


  });


});

var server = app.listen(8000, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log("Example app listening at http://%s:%s", host, port)
});

//console.log(query_skeleton_article({_id: 20442}));
//console.log(query_full_article({_id: 20442}));

// get_article(API).then((response) => {
//
//   for(var i = 0; i < 10; i += 1) {
//
//     let article = prepare_article_JSON(response[i]);
//     insert_article(article);
//
//   }
//
// }).catch((error) => {
//   console.log(error);
// });
