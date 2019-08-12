const pug = require('pug');
const path = require('path');
const getJSON = require('get-json');
const express = require('express');
/*const app = express();

const port = process.env.PORT || 3000;

/**

  Make a GET request to '/posts/render' with:
    _id : ID of the article needed to render.

**/



/*app.get('/posts/render', (req, res) => {

    if(Object.keys(req.query).length === 0){

      var data = {
        'INFO' : 'Please send a parameter to this URL to render an article.',
        'URL_FORMAT' : '<WEBSITE_NAME>/posts/render?_id=<POST_ID HERE>',
        'EXAMPLE_ENDPOINT' : '/posts/render?_id=24393',
        'FOOTER' : 'Copyright The MIT Post 2019'
      }

      res.send(data);
    }
    else {
      var _id = req.query._id;
      var url = 'https://api.themitpost.com/posts/raw/' + _id;

      getJSON(url, function(error, response){

        res.render('article',
          response);
      });
    }
}); */


module.exports.getWebContent = getWebConent = function(express_app) {

  express_app.set('views', path.join(__dirname, 'views'));
  express_app.use(express.static(path.join(__dirname, 'public')));
  express_app.set('view engine', 'pug');

  express_app.get('/posts/render/:tagId', (req, res) => {

      var _id = parseInt(req.params.tagId);
      var url = 'https://api.themitpost.com/posts/raw/' + _id;
      //It works for me only as a promise

      getJSON(url).then((response) => {
        res.render('article', response);

      }).catch((error) => {
        console.log(error);
      });

});

}

//app.listen(port);
