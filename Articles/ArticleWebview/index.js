const pug = require('pug');
const path = require('path');
const express = require('express');

var getJSON = require('get-json')

var database = require('../database');

module.exports.renderArticle = (_id) => {

  var url = 'https://app.themitpost.com/posts/raw/' + _id;

  return getJSON(url).then((response) => {

    return {_id: _id, response: response};

  }).catch((error) => {

    console.log('error');
    return Error(error);

  });

}

module.exports.getWebContent = (express_app) => {

  express_app.set('views', path.join(__dirname, 'views'));
  express_app.use(express.static(path.join(__dirname, 'public')));
  express_app.set('view engine', 'pug');

  express_app.get('/posts/render/:tagId', (request, response) => {

      var _id = parseInt(request.params.tagId);

      database.query_full_article({_id: _id}, 'unfiltered', (data) => {

        if(data) {
          console.log(response);
          response.render('article', data);

        } else {
          response.json({status: "BAD", data: []});
        }

      });

      /*getJSON('https://app.themitpost.com/posts/raw/' + _id)
        .then(function(res) {
          response.render('article', res);
        }).catch(function(error) {
          console.log(error);
        });*/

});

express_app.get('/posts/render/:tagId/dark', (request, response) => {

    var _id = parseInt(request.params.tagId);

    database.query_full_article({_id: _id}, 'unfiltered', (data) => {

      if(data) {
        console.log(response);
        response.render('article-dark', data);

      } else {
        response.json({status: "BAD", data: []});
      }

    });

    /*getJSON('https://app.themitpost.com/posts/raw/' + _id)
      .then(function(res) {
        response.render('article-dark', res);
      }).catch(function(error) {
        console.log(error);
      });*/

});

}
