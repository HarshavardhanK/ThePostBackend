
const database = require('./database.js');

const scraper = require('./scraper.js');

const bodyParser = require('body-parser');

const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT;

app.get('/slcm', (req,res) => {
  var html = "<h3>SLCM Scraper User UI</h3><br><form method='post' action='values'><table cellspacing='10'><tr><td>Enter Registration Number:</td><td><input type='text' name='regNumber' hint='Enter Registration Number'/></td></tr><tr><td>Enter Password:</td><td><input type='password' name='pass' hint='Enter Password'/></td></tr><tr><td colspan='2'><input type='submit' name='loginButton' value='Access SLCM API' style='padding:5px;width:100%;text-align:center;border-radius:7px;border:0px'/></td></tr></table></form><p><h6>&copy; The MIT Post 2019. This product does not store any details on any hardware or cloud database. <br>SLCM Scraper v3.5.0-beta</h6></p>"
  res.send(html);
});


app.post('/values', (req, res) => {


  const reg = req.body.regNumber;
  const pass = req.body.pass;

  scraper.scrape_data(reg, pass, (value) => {

    res.send(value);

  });

});

app.listen(80, () => console.log(`App listening!`));
