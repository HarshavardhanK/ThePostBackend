

const database = require('./database')
const FCM = require('fcm-node');

//Required to authenticate to FCM
const server_key = "AAAAG-SAMsE:APA91bHO8utPUH9yrRyJA37KlCSUiUg44NdyQicqJCbdk0f5oJ9eh4Rfew8uuGsnEyd_EZtcanzB7ecqL6E83wOZqfm_B3KSo4Kw1mu_8phDZJ5HM6i9TPX6k-gjBmmJquWU1zh82fKT";

const fcm = new FCM(server_key)

const generate_message = (registration_token, title, content) => {

    var message = { 
        to: registration_token, 
        //collapse_key: 'your_collapse_key',
        
        notification: {
            title: title, 
            body: content 
        }
    };

    return message
}

module.exports.send_notification_to_user = (registration_token, title, content) => {

    console.log('Notification code')
    
    const message = generate_message(registration_token, title, content)

    return fcm.send(message, function(err, response) {

        if (err) {
            console.log("Something has gone wrong!")
            console.log(err)

            return false
        } else {
            console.log("Successfully sent with response: ", response)

            return true
        }
    })

}

module.exports.send_notification = async (registration, title, content) => {

    let credentials = await database.get_credential(registration)
    console.log(credentials)

    if(credentials) {

        if(credentials.token) {
            this.send_notification_to_user(credentials.token, title, content)
        }
        
    } else {
        console.log('FCM token not found')
    }

}

// const test = () => {

//     this.send_notification('170905054', 'JOKER', 'Lets book royal seats. It is worth it')
// }

// test()
