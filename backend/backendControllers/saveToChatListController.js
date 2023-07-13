//THIS IS TO SAVE SOMEONE TO YOUR CHAT LIST WHEN THEY'RE BEEN CLICKED ON AFTER SEARCH 
const chatListModel = require('../models/chatListModel');

const saveToChatList = async (req, res) => {

    const loggedInUser = req.body.loggedInUser;
    const personToSaveToChatList = req.body.personToSaveToChatList;

    try {

    const addToChatList = new chatListModel({ loggedInUser, personToSaveToChatList });

    await addToChatList.save((err, data) => {
        
        if (err) {

            res.json(err);
            
        }

        if (data) {

            res.json({result: data.personToSaveToChatList});

        }

    })


    } catch (err) {

        console.log('db err on save to chat list: ' + err);

    }


}


module.exports = saveToChatList;