

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

const generate = () => {

    let model_data = get_data();

    let generate_data = JSON.stringify(utilities.change_attendance(model_data));

    if(generate_data) {
        fs.writeFileSync('./Generated-Data/gen-data.json', generate_data);
    }

    database.insert_slcm_data({registration: '170905022', password: 'password'}, 'slcmTests');
    
}

generate()