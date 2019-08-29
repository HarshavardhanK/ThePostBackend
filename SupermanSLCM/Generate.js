const fs = require('fs');

const utilities = require('./utilities');

const get_data = () => {

    let json_data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

    if(json_data) {
        return json_data
    }

    return null;
}

const generate = () => {

    let model_data = get_data();

    let generate_data = utilities.change_attendance(model_data);

    if(generate_data) {
        fs.writeFileSync('./Generated-Data/gen-data.json', JSON.stringify(generate_data));
    }
    
}

generate()