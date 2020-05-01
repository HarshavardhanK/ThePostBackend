
const express = require('express');
const database = require('./database.js');
const http = require('http');
const server = http.createServer(app);

var app = express();

app.get('/posts/:tagId', (request, response) => {

  query = {_id: parseInt(request.params.tagId)};
  //console.log(query);

  database.query_full_article(query, (data) => {

    if(data) {
      console.log('Query successful')
      response.json(data);

    } else {
      response.json({status: 'BAD' , data: []});
    }


  });


});

app.get('/posts/', (request, response) => {

  query = {};
  //console.log(query);

  database.query_skeleton_article_all(query, (data) => {

    if(data) {
      console.log('Query successful')
      console.log(data);
      response.json(data);

    } else {
      response.json({status: 'BAD' , data: []});
    }


  });


});

app.listen(8000, () => {
  console.log('listen at http://localhost:8000');
})
