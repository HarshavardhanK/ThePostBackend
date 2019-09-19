var firebase_admin = require('firebase-admin')

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert('./Accounts/firebase-service-account-key.json'),
    databaseURL: 'https://mit-post-244d7.firebaseio.com/'
});

console.log('imported')

var database = firebase_admin.database();

// database.ref('/sample').set({
//     name:'Harsha',
//     age:'19',
//     doing:'bored'
// });

var token = "fGJmjLqY6_A:APA91bEkWLAG5hDk7ObjtAl5j4tPR12B8O2k3h5x_w7mY_MSchedBqokGk07mBrnpZHkutKvN6qVPMBsls5bUhqhIjX9kNFXF_S-s647YPl9ViPTPbmwtBsvp1kg655UpxJ7Tbwc0Y_P"

var payload = {
                data: {
                    MyKey: 'hello'
                } 
            }

var options = {priority: 'high', timeToLive: 60 * 60 * 24}

firebase_admin.messaging().sendToDevice(token, payload, options).then(response => {
    console.log('Success', response);
}).catch(error => {
    console.log('error', error)
})
