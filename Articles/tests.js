
const database = require('./database');
const utilities = require('./utilities');


const express = require('express');
var app = express();


app.get('/:tagId', (request, response) => {

    const query = {_id: parseInt(request.params.tagId)};
    console.log(query);
    database.query_full_article(query, 'tests', (article) => {

        if(article) {
            article = utilities.prepare_article_JSON(article);
            //console.log(article);
            response.send(article);
            
        } else {
            console.log('No test article found');
        }
        
    });

})

app.listen(2000, () => {
    console.log('Server on at localhost:2000');
});