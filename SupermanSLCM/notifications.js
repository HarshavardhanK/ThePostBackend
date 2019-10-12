

const database = require('./database')
const FCM = require('fcm-node');

//Required to authenticate to FCM
const server_key = "AAAAG-SAMsE:APA91bHO8utPUH9yrRyJA37KlCSUiUg44NdyQicqJCbdk0f5oJ9eh4Rfew8uuGsnEyd_EZtcanzB7ecqL6E83wOZqfm_B3KSo4Kw1mu_8phDZJ5HM6i9TPX6k-gjBmmJquWU1zh82fKT";

const fcm = new FCM(server_key)

const generate_message = (registration_token, title, content, type='general') => {

    var message = { 
        to: registration_token, 
        //collapse_key: 'your_collapse_key',
        
        notification: {
            title: title, 
            body: content,
            sound: "default",
            badge: 1,
            type: type
        },
        data: {
            isSLCM: true
        }
    };

    return message
}

module.exports.send_notification_to_user = (registration_token, title, content, type) => {

    console.log('Notification code')

    if(registration_token != null) {

        const message = generate_message(registration_token, title, content, type)

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

}

module.exports.send_notification = async (registration, title, content, type) => {

    let credentials = await database.get_credential(registration)
    console.log(credentials)

    if(credentials) {

        if(credentials.token) {
            this.send_notification_to_user(credentials.token, title, content, type)
        }
        
    } else {
        console.log('FCM token not found')
    }

}

const test = () => {

    this.send_notification('170905022', 'JOKER', 'AMAZING MOVIE', 'slcm')

    //let token = "dRsw1xcUFLM:APA91bEpIh_xlpbBJOudK9k1TgIbnPfAtJyENBE6y-dGdrXj-39XC-cW4bfs_-c7ppOBKyJFkO-sakAY8iUW6iguWYEHESx_wSMUR4P3sVWNhAyBI-rBkAEVAstxIEwMxbfRB2_GeHjh"
    //this.send_notification_to_user(token, "Knock knock, October", "Who? Anshu month is that you?")
}



test()
