//THIS IS TO FETCH A PARTICULAR USER CHATLIST ON EVERY RENDER OF THE CHATLIST PAGE. 
const chatListModel = require('../models/chatListModel');

const getMyChatList = async (req, res) => {

    const loggedInUser = req.body.loggedInUser;
console.log('log this' + loggedInUser)

    try { 

        chatListModel.find({loggedInUser: loggedInUser}, (err, data) => {

            if (err) {
                console.log(err)
            }

            if (data) {
            //  console.log('datum' + data.find((item => item.personToSaveToChatList)))
                res.json(data)
            }

        })

    } catch (err) {

        console.log('db err on getting my chat list: ' + err);

    }
   
    
    
}

module.exports = getMyChatList;