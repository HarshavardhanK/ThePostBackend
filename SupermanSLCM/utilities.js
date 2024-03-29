const fs = require('fs');

const notifications = require("./notifications")

module.exports.get_attendance_for = (complete_object, index=null) => {

    if(complete_object) {

        let attendance_obj = complete_object.academicDetails[0].attendance

        if(index == null) {
            return attendance_obj

        } else {

            if(index > attendance_obj.length) {
                return attendance_obj[attendance_obj.length - 1]

            } else {
                return attendance_obj[index]
            }

        }
    } else {

        return null;
    }
}

module.exports.get_marks_for = (complete_object, index=null) => {

    if(complete_object) {

        let marks_obj = complete_object.academicDetails[0].internalMarks
        console.log(marks_obj.length)

        if(index == null) {
            return marks_obj
        }

        if(index > marks_obj.length) {
            return marks_obj[marks_obj.length - 1]

        } else {
            return marks_obj[index]
        }

    } else {
        console.log('null object')
        return null
    }
}

//CODE FOR GENERATING NEW SLCM DATA

module.exports.get_random_attendance = (subjectName) => {

    let total = Math.round(Math.random() * (40 - 5)) + 5;
    let absent = Math.round(Math.random() * (total - 2)) + 2;
    let present = total - absent;

    return {'subjectName': subjectName,
            'totalClasses': total.toString(),
            'classesAttended': present.toString(),
            'classesAbsent': absent.toString()
            };
}

module.exports.get_random_marks = (subjectName, sessional, assignment) => {

    var marks = "NA"

    let marks1 = "NA"
    let marks2 = "NA"
    let marks3 = "NA"
    let marks4 = "NA"

    if(sessional) {
        marks = Math.round(Math.random() * (15 - 5)) + 5
    }

    if(assignment) {
        console.log('Changing assignment marks all')

         marks1 = Math.round(Math.random() * (5 - 0))
         marks2 = Math.round(Math.random() * (5 - 0))
         marks3 = Math.round(Math.random() * (5 - 0))
         marks4 = Math.round(Math.random() * (5 - 0))
    }

    return {"subject_name": subjectName,

            "status": true,
            "is_lab":false,

            "sessional": {
                "_one": marks.toString(),
                "_two": 'NA'
            },

            "assignment": {
                "_one": marks1.toString(),
                "_two": marks2.toString(),
                "_three": marks3.toString(),
                "_four": marks4.toString()
            },

            "lab": {
                "assessments": []
            }
        }


}

module.exports.change_attendance = (complete_object, which=null) => {

    let change_number = Math.round(Math.random() * (this.get_attendance_for(complete_object).length - 0));

    let attendance_obj = this.get_attendance_for(complete_object, change_number);

    let gen_attendance = this.get_random_attendance(attendance_obj.subjectName);

    let new_complete_object = complete_object;
    new_complete_object.academicDetails[0].attendance[change_number] = gen_attendance;

    console.log('Changed this');
    console.log(gen_attendance);

    return new_complete_object;

}

module.exports.change_marks = (complete_object) => {

    let marks = this.get_marks_for(complete_object)
    let change_number = Math.round(Math.random() * (4 - 0));
    console.log("Change number is %d", change_number)

    console.log("change num marks %s", marks[change_number]);
    let gen_marks = this.get_random_marks(marks[change_number].subject_name, true, true);

    let new_obj = complete_object;
    new_obj.academicDetails[0].internalMarks[change_number] = gen_marks

    console.log("Changed this marks")
    console.log(gen_marks)

    return new_obj

}

const check_attendance_component = (cred, new_component, current_component) => {

    //Add code for Firebase notifications

    if(new_component != null && current_component != null) {

        if(new_component.subjectName !== current_component.subjectName) {
            return false;
        }

        let subjectname = this.sanitize_subject_name(new_component.subjectName.substring(9, new_component.subjectName.length))

        // Check only total classes since any change in attendance the total classes value HAS to increase
        // open for debate since attendance changes can happen w/o total classes

        if(new_component.totalClasses !== current_component.totalClasses) {

            if(cred.status === 'active') {

                /*let body = this.sanitize_subject_name(new_component.subjectName) + " attendance updated"
                console.log(body)
                notifications.send_notification(cred.registration, 'Attendance Updated. Tap to check 👆', body, "slcm")*/
                console.log('Old totalClasses value %s | New totalClasses value %s', current_component.totalClasses, new_component.totalClasses);

            } else {
                console.log('No notifications. Account inactive')
            }
            
            return true
        }

    }

    return false;
}

const check_marks_component = (cred, new_object, current_object) => {

    //Add code for Firebase notifications

    var somethingChanged = false

    var sessionalChanged = [false, false]
    var assignmentChanged = [false, false, false, false]

    if(new_object != null && current_object != null) {
        let subjectname = this.sanitize_subject_name(new_object.subject_name.substring(9, new_object.subject_name.length))
        

        console.log("Recevied new object")
        //console.log(new_object)

        if(new_object.subject_name !== current_object.subject_name) {
          console.log(new_object.subject_name, current_object.subject_name);
          console.log('lol')
          return false;
        }

        if(new_object.is_lab || current_object.is_lab) {

           console.log('is lab.')

           if(new_object.lab.assessments.length != current_object.lab.assessments.length) {
               let title = subjectname + " marks added"
               notifications.send_notification(cred.registration, title, "", 'slcm')
               return true
           }

           return false
        }

        if(new_object.status) {

            if(new_object.sessional._one !== current_object.sessional._one) {
                console.log('session 1 change')
                sessionalChanged[0] = true
            }

            if(new_object.sessional._two !== current_object.sessional._two) {
                console.log('session 2 change')
                sessionalChanged[1] = true
            }

            if(new_object.assignment._one != current_object.assignment._one) {
                console.log('assignment 1 change')
                assignmentChanged[0] = true
            }

            if(new_object.assignment._two != current_object.assignment._two) {
                console.log('assignment 2 change')
                assignmentChanged[1] = true
            }

            if(new_object.assignment._three != current_object.assignment._three) {
                console.log('assignment 3 change')
                assignmentChanged[2] = true
            }

            if(new_object.assignment._four != current_object.assignment._four) {
                console.log('assignment 4 change')
                assignmentChanged[3] = true
            }

            for(var i = 0; i < 2; i++) {

                if(sessionalChanged[i]) {

                    if(cred.status === 'active') {
                        let body = subjectname + " marks updated"
                        console.log(body)
                        let what = 'Sessional ' + (i + 1) + " marks updated. Tap to check 👆"
                        notifications.send_notification(cred.registration, what, body, "slcm")

                    } else {
                        console.log('No notifications. Account inactive')
                    }
                    
                    somethingChanged = true;
                }

            }

            for(var i = 0; i < 4; i++) {

                if(assignmentChanged[i]) {

                    if(cred.status === 'active') {
                        let body = subjectname + " marks updated"
                        console.log(body)
                        let what = "Assignment " + (i + 1) + " marks uploaded. Tap to see 👆"
                        notifications.send_notification(cred.registration, what, body, "slcm")

                    } else {
                        console.log('No notifications. Account inactive')
                    }
                    
                    somethingChanged = true;
                }
            }

            return somethingChanged


        } else {
            return false;
        }
    }
}

//CODE FOR CHECKING TWO SLCM DATA OBJECTS FOR DIFFERENCE

module.exports.check = (cred, current_object, new_object) => {

    console.log("Credentials")
    console.log(cred)

    let marks_change = false;
    let attendance_change = false;

    let change = false;

    let current_attn = this.get_attendance_for(current_object);
    let new_attn = this.get_attendance_for(new_object);

    let current_marks = this.get_marks_for(current_object);
    let new_marks = this.get_marks_for(new_object)

    //Holds names of subjects in which attendance has changed
    //This is to ensure that attendance update notification isn't sent multiple times. Can get annoying.

    let attendance_change_arr = []

    for(var i = 0; i < current_attn.length; i++) {

        if(check_attendance_component(cred, new_attn[i], current_attn[i])) {

            attendance_change = true;
            console.log('Difference in attendance %s', current_attn[i].subjectName);

            attendance_change_arr.push(current_attn[i].subjectName)

            new_attn[i].updatedAt = new Date().getTime();
            current_object.academicDetails[0].attendance[i] = new_attn[i];
        }
    }

    if(attendance_change_arr.length > 2) {

        let title = "Attedance updated"
        let body = "Attendance of " + attendance_change_arr.length + " subjects updated. Tap to check 👆"

        notifications.send_notification(cred.registration, title, body, "slcm")

    } else {

        for(var i = 0; i < attendance_change_arr.length; i += 1) {

            let title = "Attendance updated"
            let body = "Attendance of " + attendance_change_arr[i] + " updated. Tap to check 👆"

            notifications.send_notification(cred.registration, title, body, "slcm")
            
        }
    }

    for(var i = 0; i < current_marks.length; i++) {

        if(check_marks_component(cred, new_marks[i], current_marks[i])) {

            marks_change = true;
            console.log("Difference in marks %s", current_marks[i].subject_name)

            new_marks[i].updatedAt = new Date().getTime();
            current_object.academicDetails[0].internalMarks[i] = new_marks[i];
        
        }

    }

    
    if(marks_change || attendance_change) {
        change = true
    }

    return {change: change, value: current_object};

}

module.exports.sanitize = (fresh_object) => {

    let attn = this.get_attendance_for(fresh_object)
    let marks = this.get_marks_for(fresh_object)

    for(var i = 0; i < attn.length; i++) {

        if(!attn[i].updatedAt && !marks[i].updatedAt) {
            marks[i].updatedAt = -1
            attn[i].updatedAt = -1
        }
    }

    fresh_object.academicDetails[0].attendance = attn;
    fresh_object.academicDetails[0].internalMarks = marks;

    return fresh_object;
}

//Subject name sanitizer
module.exports.sanitize_subject_name = (name) => {

    return name.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}


//TIME UTITLITIES

module.exports.seconds = function(seconds) {
    return seconds * 1000;
  };

module.exports.minutes = function(minutes) {
    return 1000 * 60 * minutes;
  };

module.exports.hours = function(hours) {
    return 1000 * 60 * 60 * hours;
  };

module.exports.days = function(days) {
    return 1000 * 60 * 60 * 24 * days;
  };
