const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017/themitpost";

const crypto = require('./encryption')
const database = require('./database')

const decrypt_store = async () => {
    
    let client = await MongoClient.connect(url, {useUnifiedTopology: true}).catch((error) => console.log(error));

    try {

        let collection = client.db('themitpost').collection('ios')
        let collection_stats = client.db('themitpost').collection('stats')

        //let id = new ObjectId()

        let data = await collection.find().map(doc => {crypto.decrypt_store(doc)}).toArray()
        console.log(data);
        //let success = await collection_stats.insertMany(data)

        //console.log(success)
        

        

    } catch(error) {
        console.log(error);
        
    } finally {
        client.close();
    }
    
}

module.exports.get_average_sessional = async (subject_name) => {

    let client = await MongoClient.connect(url, {useUnifiedTopology: true}).catch((error) => console.log(error));

    try {

        let collection = client.db('themitpost').collection('ios')

        let group = collection.aggregate([
            {
                $group: {

                    _id: subject_name, 
                    
                }
            }
        ])

        console.log(group)

    } catch(error) {
        console.log(error)

    } finally {
        client.close();
    }
    
}

decrypt_store()

//this.get_average_sessional("")