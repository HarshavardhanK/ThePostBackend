const database = require('./database')
const fs = require('fs');

const createDemo = () => {
    let json_data = JSON.parse(fs.readFileSync('Generated-Data/marks-gen-data.json', 'utf-8'));

    var registration = '123456789'
    var password = 'johnappleseed'

    console.log(password)

    database.insert_slcm_data({_id: registration, registration: registration, password: password}, json_data, 'ios')
}

createDemo()