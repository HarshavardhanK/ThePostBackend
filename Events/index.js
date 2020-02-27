const url = require('url')

const database = require('./database.js');

const sortEvents = (eventsList) => {
  
  return new Promise(function(resolve, reject) {

    eventsList.sort(function(eventA, eventB) {

      eventA.difference = (eventA.timestamp - Date.now()) 
      eventB.difference = (eventB.timestamp - Date.now())

      return eventA.difference < eventB.difference 
    })

    let currEvents = eventsList.filter(function(event) {
      return event.difference > 0
    })

    console.log("running events")
    currEvents = currEvents.reverse()
    console.log(currEvents)

    let expiredEvents = eventsList.filter(function(event) {
      return event.difference < 0
    })

    console.log("expired events")
    console.log(expiredEvents)

    let result = currEvents.concat(expiredEvents)

    console.log("Full")
    console.log(result)

    resolve(result)

  })


}


module.exports.post_events = (app) => {

  app.post('/portal/events/submitted', function(request, response) {

    const club = request.body.club;
    const title = request.body.title;
    const content = request.body.content;
    const imageURL = request.body.imageURL;
    const date = request.body.date;
    const time = request.body.time;
    const location = request.body.location;
    var formLink = request.body.formLink;
    const passcode = request.body.pass;

    if(passcode != ':e<3,F )-H]h^eP-'){
      response.send('Event NOT added. Check back all details.');
    }
    else {

      if(formLink.trim() == ""){
        formLink = "NA";
      }

      const event = {
        clubName: club,
        title: title,
        content: content,
        imageURL: imageURL,
        date: date,
        time: time,
        formLink: formLink,
        location: location
      };

      database.insert_event(event).then(success => {
        response.send("<h1>EVENT INSERTED<h1>");
        
      })
      .catch(error => {
        response.send("<h1>ERROR.<h1>");
      })

    };
  });
}

module.exports.get_events = (app) => {

  app.get('/events', function(request, response) {

    let url_parts = url.parse(request.url, true)
    let sorted = url_parts.query.sorted

    if(sorted === 'yes') {

      database.get_events_sorted().then(result => {

        let value = {}
        value.data = result
        value.status = 'OK'

        response.json(value);

      })
      .catch(err => {
        console.log(err);
      })

    } else {

      database.get_event_all()
      .then(result => {
  
        let value = {}
        value.data = result
        value.status = "OK"
  
        response.json(value)
  
      })
      .catch(err => {
        response.json({"status" : "BAD"})
      })

    }   

  });

}




const testSorting = () => {

  database.get_event_all().then(events => {

    sortEvents(events).then(result => {
      //console.log("printing events")
      //console.log(events)
    })

  })

}

//testSorting()