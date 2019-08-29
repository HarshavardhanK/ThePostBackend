

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

    let total = Math.random() * (40 - 5) + 5;
    let absent = Math.random() * (20 - 2) + 2;
    let present = total - absent;

    return {'subjectName': subjectName, 
            'totalClasses': Math.round(total).toString(), 
            'classesAttended': Math.round(present).toString(), 
            'classesAbsent': Math.round(absent).toString()};
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
