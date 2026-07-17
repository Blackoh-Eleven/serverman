const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    profileName: String,
    email: String,
    password:String
})

const userFormat = mongoose.model('User', userSchema)

module.exports = userFormat