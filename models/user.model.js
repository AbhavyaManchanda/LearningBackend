const mongoose = require('mongoose');

//blueprint hai user ka - user jesa dikhne wala hai
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength:[3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength:[13, 'Email must be at least 13 characters long'],
        

    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength: [6, 'Password must be at least 6 characters long']
    }
})

//abhi ye schema hai, isko model mein convert karna hai
//model banane ke liye mongoose ki method use karte hain
//model ka naam hamesha singular hota hai, mongoose automatically plural bana deta hai
//example: user model -> users collection in database
const user = mongoose.model('user', userSchema);

module.exports = user;