
const database = require('./database')
const utils = require('./utilities')
const crypto = require('./encryption')

const notifications = require("./notifications")

module.exports.attendance_danger = (object, cred) => {

    let attendance = utils.get_attendance_for(object)

    if(!attendance || !attendance.length) {
        return
    }

    var percents = []
    var names = []

    console.log(attendance)

    let title = "Attendance below 75% warning!"

    for(var i = 0; i < attendance.length; i += 1) {

        let total = attendance[i].totalClasses

        if(total > 0) {

            try {

                let attended = parseInt(attendance[i].classesAttended)
                let absent = parseInt(attendance[i].classesAbsent)

                let percent = attended / total * 100.0

                if(percent < 75.0) {
                    percents[i] = percent

                    names.push(utils.sanitize_subject_name(attendance[i].subjectName))

                }


            } catch(error) {
                console.log(error);
            }

        }

    }

    if(cred.status === 'active') {

        if(names.length > 2) {
            let body = "Attendance of multiple subjects have dropped below 75%"
            notifications.send_notification(cred.registration, title, body, "slcm")
    
        } else {
    
            for(var i = 0; i < names.length; i += 1) {
                let body = "Your attendance in " + names[i] + " is now at " + Math.round(percents[i]) + "%"
                notifications.send_notification(cred.registration, title, body, "slcm")
            }
        }

    }

}