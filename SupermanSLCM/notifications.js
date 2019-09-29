


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

const test = () => {
    var token = "e6cGjCkIkZU:APA91bHvhL1MoEolKheLROxaeEhoobRr0t_XUaJ3zlDp2l4EHgTYHCUE0SaQclFM5Crt80GuWikiP4BJFsZmqH3z0nXUVs5lr3bgrQKE_0M36F9lDW4Y6tlaCXE8d_V8EJq4iiHJIDoP"
    var title = "SLCM Test"
    var content = "Tu Madarchhod h"

    this.send_notification_to_user(token, title, content)
}

test()
