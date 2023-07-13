//THIS IS OUR DB MODEL FOR CREATING NOTIFICATION
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    personToAddToNotificationList: {
        type: String,
        required: true
    }

});

const notificationModel = mongoose.model('notifications', notificationSchema);

module.exports = notificationModel;