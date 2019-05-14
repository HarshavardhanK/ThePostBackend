

// const express = require('express');
// const app = express();
//
// app.get('/', function(req, res) {
//   res.send('Hello World!');
// });
//
// const server = app.listen(8081, function() {
//   let host = server.address().address;
//   let port = server.address().port;
//
//   console.log("Example app listening at http://%s:%s", host, port);
// })

var express = require('express');
var app = express();

app.get('/users/:tagId', function (req, res) {
   res.send('Hello World');
   console.log('TagID %d', req.params.tagId);
});

var server = app.listen(8000, function () {
   var host = server.address().address;
   var port = server.address().port;

   console.log(host);
   console.log(port);

   console.log("Example app listening at http://%s:%s", host, port)
});
