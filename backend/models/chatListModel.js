//THIS IS OUR DB MODEL FOR CREATING CHATLIST
const mongoose = require('mongoose');

const chatListSchema = new mongoose.Schema({

    loggedInUser: {
        type: String,
    },

    personToSaveToChatList: {
        type: String,
    }

});

const chatListModel = mongoose.model('chatList', chatListSchema);

module.exports = chatListModel;