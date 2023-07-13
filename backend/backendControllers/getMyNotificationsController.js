const notificationModel = require("../models/notificationModel");

const getMyNotifications = (req, res) => {

    const user = req.body.username;

    try {
   
        notificationModel.find({username: user}).then((response) => {

            console.log('getRes' + response)
            res.json(response)

        }).catch((err) => { 

            console.log('getRes' + err);
            res.json(err)
        })
         
    } catch (err) {
        
    }
    

}

module.exports = getMyNotifications;