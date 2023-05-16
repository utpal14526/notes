
const mongoose = require('mongoose')

const URI="mongodb://127.0.0.1:27017/inotebook";

// this will 

const connecttomongo = async () => {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(URI) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error);
    }
}

module.exports = connecttomongo

// updated version to connect with db
