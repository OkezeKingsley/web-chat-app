//THIS IS OUR DB MODEL FOR CREATING MESSAGES
const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({

    message: {
        type: String,
        required: true
    },

    from: {
        type: String,
        required: true
    },

    to: {
        type: String,
        required: true
    }
    
}, {timestamps: true});

const messagesModel = mongoose.model('messages', messagesSchema)

module.exports = messagesModel;