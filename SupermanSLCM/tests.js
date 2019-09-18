
const fs = require('fs');
const utilities = require('./utilities');
const database = require('./database');

const get_data = () => {

    let json_data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

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

    let model_data = get_data();

    let generate_data = JSON.stringify(utilities.change_marks(model_data));

    if(generate_data) {
        fs.writeFileSync('Generated-Data/marks-gen-data.json', generate_data);
    }
    
}

generate_marks()