//THIS IS OUR DB MODEL FOR CREATING USER
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required:true,
        unique:true
    },

    email: {
        type: String,
        required:true,
        unique:true
    },

    password: {
        type:String,
        required:true,
    },

    user_id: {
        type: String,
        required: true,
        unique: true
    },

    profile_picture: {
        type: String,
        default: ''
    }
    
    
}, {timestamps: true})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel;