const notificationModel = require("../models/notificationModel");

const removeThisUserNotification = async (req, res) => {

    const user = req.body.loggedInUser;

    const personToRemove = req.body.personToRemove;

    try {

        await notificationModel.deleteMany({

            $and : [{ username: user }, { personToAddToNotificationList: personToRemove }]

        }).then((data) => console.log('data to delete is' + data)).catch((err) => {
            
            console.log('err delete is' + err)
        })

        notificationModel.find({username: user}).then((result) => {

            console.log('remaining notification is ' + result)

            console.log('res typeof is ' + typeof result)

            res.json(result)

            }).catch((err) => {

                console.log('err getting remaining notification list: ' + err)

   
            })
    
        } catch (err) {

            console.log('err connecting to notification server' + err)

        }
    

    
}

module.exports = removeThisUserNotification;