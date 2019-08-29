const fs = require('fs');

//CODE FOR GENERATING NEW SLCM DATA
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

const check_attendance_component = (new_component, current_component) => {

    //Add code for Firebase notifications

    if(new_component != null && current_component != null) {

        if(new_component.subjectName !== current_component.subjectName) {
            return true;
        }

        // Check only total classes since any change in attendance the total classes value HAS to increase 
        // open for debate since attendance changes can happen w/o total classes

        if(new_component.totalClasses !== current_component.totalClasses) {
            console.log('Old totalClasses value %s | New totalClasses value %s', current_component.totalClasses, new_component.totalClasses);
            return true
        }

    } 

    return false;
}

//CODE FOR CHECKING TWO SLCM DATA OBJECTS FOR DIFFERENCE    

module.exports.check = (current_object, new_object) => {

    let change = false;

    /*let current_object = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
    let new_object = JSON.parse(fs.readFileSync('Generated-Data/gen-data.json', 'utf-8'))*/

    let current_attn = this.get_attendance_for(current_object);
    let new_attn = this.get_attendance_for(new_object);

    for(var i = 0; i < current_attn.length; i++) {

        if(check_attendance_component(new_attn[i], current_attn[i])) {
            change = true;
            console.log('Difference in %s', old_attn[i].subjectName);
        }
    }
    
    return change;

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
  
