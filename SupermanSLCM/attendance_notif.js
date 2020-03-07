
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

    var case2_percents = []
    var case2_names = []

    console.log(attendance)

    let title = "Attendance below 75% warning!"

    for(var i = 0; i < attendance.length; i += 1) {

        let total = attendance[i].totalClasses

        if(total > 0) {

            try {

                let attended = parseInt(attendance[i].classesAttended)
                let absent = parseInt(attendance[i].classesAbsent)
                let subjectName = utils.sanitize_subject_name(attendance[i].subjectName)

                let percent = attended / total * 100.0

                if(percent < 75.0) {

                    percents.push(percent)
                    names.push(subjectName)

                } else if(percent >= 75.0 && percent <= 78.0) {

                    case2_percents.push(percent)
                    case2_names.push(subjectName)

                }


            } catch(error) {
                console.log(error);
            }

        }

    }

    if(cred.status === 'active') {

        if(names.length > 2) {
            let body = "Attendance of " + names.length + " subjects has dropped below 75% 😕"
            notifications.send_notification(cred.registration, title, body, "slcm")
    
        } else {
    
            for(var i = 0; i < names.length; i += 1) {
                let body = "Your attendance in " + names[i] + " is now at " + Math.round(percents[i]) + "% 🙁"
                notifications.send_notification(cred.registration, title, body, "slcm")
            }
        }

    }

    if(cred.status === 'active') {

        if(case2_names.length > 2) {

            let title = "Attendance warning 🔴"
            let body = "Your attendance in " + case2_names.length + " subjects is very close to 75%"

            notifications.send_notification(cred.registration, title, body, "slcm")

        } else {

            for(var i = 0; i < case2_names.length; i += 1) {

                let title = "Attendance warning 🔴"
                let body = "Your attendance in " + case2_names[i] + " is at " + Math.round(case2_percents[i])

                notifications.send_notification(cred.registration, title, body, "slcm")

            }


        }


    }


}

module.exports.attendance_awesome = (object, cred) => {

    let attendance = utils.get_attendance_for(object)

    if(!attendance || !attendance.length) {
        return
    }

    var percents = []
    var names = []

    console.log(attendance)

    let titles = ["Streak 🔥", "Going strong! 📚", "Well done! 😁"]

    for(var i = 0; i < attendance.length; i += 1) {

        let total = attendance[i].totalClasses

        if(total > 0) {

            try {

                let attended = parseInt(attendance[i].classesAttended)
                let absent = parseInt(attendance[i].classesAbsent)

                let percent = (attended / total) * 100.0

                if((percent >= 90.0 && total >= 10) && ((total % 3 == 0) || (total % 4 == 0))) {
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

            let title = "Streak 🔥"

            let body = "Attendance of " + names.length + " subjects is above 90% 💪"
            //let body = "Need some more?"
            notifications.send_notification(cred.registration, title, body, "slcm")
    
        } else {
    
            for(var i = 0; i < names.length; i += 1) {

                if(percents[i]) {

                    let title_index = titles % names.length
                    let title = "Streak 🔥"

                    let body = "Your attendance in " + names[i] + " is at " + Math.round(percents[i]) + "% 💪"
                    notifications.send_notification(cred.registration, title, body, "slcm")

                } 

                
            }

        }

    }

}