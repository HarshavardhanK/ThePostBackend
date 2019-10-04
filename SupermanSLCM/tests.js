
const fs = require('fs');
const utilities = require('./utilities');
const database = require('./database');

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
generate_marks()
compare_marks()