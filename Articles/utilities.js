
const striptags = require('striptags');
const get_urls = require('get-urls');

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

    var url = string_window(body, indices[i], 170);
    url = Array.from(get_urls(url)); //get_urls return a set

    key = indices[i];

    url_object = {url : url[0], index: key};

    urls.push(url_object);

  }

  console.log(urls.length);

  return urls;

};

/*
compare_urls function aims to solve the following problem:

I will the take 1st image URL since I know its an original image, and the URL is also shorter in length
Compare that URL with the ones below only for the length of the first URL. If there is a match, then
the image below is a lesser quality version URL.
*/

const group_urls = function(urls) {

  if(urls.length <= 0) {

    return [];
  }

  var grouped_urls = [];
  var parent_group = [];
  var rank = 0;

  let jpg_index = urls[0].url.indexOf('.jpg');
  let jpeg_index = urls[0].url.indexOf('.jpeg');
  let png_index = urls[0].url.indexOf('.png');

  var parent_url;
  var previous_parent_url;

  if(jpeg_index == -1 && jpg_index == -1 && png_index == -1) {
    console.log(urls[0].url + " not an image.");
    parent_url = urls[0].url;

  } else {

    if(jpg_index != -1){
      parent_url = urls[0].url.substr(0, jpg_index + 5);
  
    } 
    
    if(jpeg_index != -1) {
      parent_url = urls[0].url.substr(0, jpeg_index + 4)
    }

    if(png_index != -1) {
      parent_url = urls[0].url.substr(0, png_index + 4);
    }

  }

  previous_parent_url = parent_url;

    for(var i = 0; i < urls.length; i += 1) {

      jpg_index = urls[i].url.indexOf('.jpg');
      jpeg_index = urls[i].url.indexOf('.jpeg');
      ng_index = urls[0].url.indexOf('.png');

      if(jpeg_index == -1 && jpg_index == -1 && png_index == -1) {
        console.log(urls[i].url + " not an image.");
        parent_url = urls[0].url;

        url_ordering = {url: urls[i].url, index: urls[i].index, rank: rank};
        grouped_urls.push(url_ordering);
    
      } else {
      
        if(jpg_index != -1){
          parent_url = urls[0].url.substr(0, jpg_index + 5);
        
        } 
          
        if(jpeg_index != -1) {
          parent_url = urls[0].url.substr(0, jpeg_index + 4)
        }
      
        if(png_index != -1) {
          parent_url = urls[0].url.substr(0, png_index + 4);
        }
    
      }

      if(previous_parent_url !== parent_url) {

        console.log(previous_parent_url);
        console.log(parent_url);

        url_ordering = {url: urls[i].url, index: urls[i].index, rank: rank};
        grouped_urls.push(url_ordering);

        let jpg_index = urls[i].url.indexOf('.jpg');
        let jpeg_index = urls[i].url.indexOf('.jpeg');

        previous_parent_url = parent_url;

      } else {
        rank += 1
      }

    }

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

  return paragraph_array;

};

// TODO: Align paragraphs and image URLS into a single list of JSON paragraph objects..

const merge_images_paragraphs = function(grouped_urls, paragraph_array) {

  var final_object = [];

  var url_iter = 0;
  var para_iter = 0;

  const paragraph_array_length = paragraph_array.length;
  const grouped_urls_length = grouped_urls.length;

  var url =  grouped_urls[url_iter];
  var paragraph = paragraph_array[para_iter];

  console.log(grouped_urls.length);
  console.log(grouped_urls);

  if(grouped_urls.length == 0 && paragraph_array_length > 0) {

    while(para_iter < paragraph_array_length) {

      paragraph = paragraph_array[para_iter];

      if((paragraph) && (paragraph.content != '')) {

        content = {content: paragraph.content, isImage: false, isHyperlink: false};
        final_object.push(content);
        
      }

      para_iter += 1;

    }

    return final_object;

  }
  
  while(url_iter < grouped_urls_length && para_iter < paragraph_array_length) {

    url =  grouped_urls[url_iter];
    paragraph = paragraph_array[para_iter];

    if(url.index < paragraph_array[para_iter].begin_index) {
      
      if(url.url.indexOf(".jpg") != -1 || url.url.indexOf(".jpeg") != -1 || url.url.indexOf('.png') != -1) {
        content = {content: url.url, isImage: true, isHyperlink: false};
        console.log(content);
        final_object.push(content);

      } else {
        
        content = {content: url.url, isImage: false, isHyperlink: true};
        final_object.push(content);
      }

      url_iter += 1;

    } else {

      if((paragraph) && (paragraph.content != '')) {

        content = {content: paragraph.content, isImage: false, isHyperlink: false};
        //console.log(content);
        final_object.push(content);

      }

      para_iter += 1;
      
    }

  }

    while(para_iter < paragraph_array_length) {
      paragraph = paragraph_array[para_iter];

      if((paragraph) && (paragraph.content != '')) {
        
        content = {content: paragraph.content, isImage: false, isHyperlink: false};
        final_object.push(content);
      
      }

      para_iter += 1;

    }

    while(url_iter < grouped_urls_length) {

      url =  grouped_urls[url_iter];

      if(url.url.indexOf(".jpg") != -1 || url.url.indexOf(".jpeg") != -1) {
        content = {content: url.url, isImage: true, isHyperlink: false};
        final_object.push(content);
        console.log(content);
        
      } else {
        content = {content: url.url, isImage: false, isHyperlink: true};
        final_object.push(content);
        
      }

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
isCaption: false,
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
  let id = article._id;
  let link = article.link;
  let featured_media = article.featured_media;
  let message = article.message;

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
                        author: article.author,
                        message: message

                      };

    //console.log(article_JSON);

  return article_JSON;

};

module.exports.prepare_article_JSON = prepare_article_JSON;
module.exports.get_date = get_date;

