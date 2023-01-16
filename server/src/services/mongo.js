const {mongoPass} = require('../config')
const MONGO_URL = `mongodb+srv://AnNguyen:${mongoPass}@cluster0.l1lo9qe.mongodb.net/?retryWrites=true&w=majority`
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connection.once('open', () =>{
    console.log('Mongoose ready')
})

mongoose.connection.on('error',(err)=>{
    console.log(err)
})

const mongoConnect = async () => {
    await mongoose.connect(MONGO_URL)
}

const mongoDisconnect = async () => {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}