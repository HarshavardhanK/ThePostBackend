
const fs = require('fs');
const utilities = require('./utilities');
const database = require('./database');
const crpyto = require('./encryption')

const attendance_notif = require('./attendance_notif')

const get_data = (filename) => {

    let json_data = JSON.parse(fs.readFileSync(filename, 'utf-8'));

    if(json_data) {
        return json_data
    }

    return null;
}

const generate_attendance = () => {

    let model_data = get_data();

    let generate_data = JSON.stringify(utilities.change_attendance(model_data));

    if(generate_data) {
        fs.writeFileSync('Generated-Data/marks-gen-data.json', generate_data);
    }
    
}

const generate_marks = () => {

    let model_data = get_data('data.json');

    let generate_data = JSON.stringify(utilities.change_marks(model_data));

    if(generate_data) {
        fs.writeFileSync('Generated-Data/marks-gen-data.json', generate_data);
    }
    
}

const compare_marks = async () => {

    let original = get_data('data.json')
    let generated = get_data('./Generated-Data/marks-gen-data.json')

    let cred = await database.get_credential('170905022')
    console.log(cred)

    let check = utilities.check(cred, original, generated)

    if(check.change) {
        console.log('change detected')
    }
}

const check_attendance_notification = async () => {

    //let token = "cah-3pEzYRo:APA91bGA-NZeu-P7JzXnfE2a_WgfHFnWtHdlSxwSs-UOUDpYZSxWtoXTkEMVolsYv6UMhxBm8stimV5UfhBM9SJbWxYcRIwfNs5opugHJQjC6a0J1wY2yFd4LWKD_hiOCO3OutquE7oW"
    let token = "fPoOEi4Mrf0:APA91bHWRz_tY5lhlFEK5OjwkmNzD-tIESdlEMaEo7BIj1vluUng-Q8hcSfCL2AEsK-FenDw4AozAQoPRTYM13m05ONAzHDUTN5Pvp0ueZR_We3sYVM7ihk6vqLbTu5vXAzdQuwV6bl1"

    let data = get_data('data.json')
    //let cred = await database.get_credential('170905022')
    let cred = {}
    cred.registration = '170905022'
    cred.password = "FHJ-CSd-5rc-f5A"
    //cred.password = crpyto.encrypt(password, cred.registration)
    cred._id = '170905022'
    //console.log(cred)
    cred.token = token
    cred.status = 'active'

    await database.insert_credentials(cred)

    await database.insert_token(cred, token)

    cred = await database.get_credential('170905022')

    console.log(cred.token)

    attendance_notif.attendance_danger(data, cred)
    attendance_notif.attendance_awesome(data, cred)
}

check_attendance_notification()