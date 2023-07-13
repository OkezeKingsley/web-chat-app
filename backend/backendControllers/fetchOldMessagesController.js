//This function helps in fetching old messages with a users
const messagesModel = require("../models/messagesModel");


const fetchOldMessagesWithThisUser = async (req, res) => {
    //we're assinging information in the req.body to unique variables(in this case   
    //which is the from and to properties). Who is sending and who is receiving. 
    const sender = req.body.from;
    const receiver = req.body.to;

    if (sender && receiver) { 

      await messagesModel.find({ 
        
        $or: [

        { from: sender, to: receiver},

        { from: receiver, to: sender}

     ]
    
    }).then((result) => {

     //Let's reverse the array of messages so that when we use the unshift() method
     //in the front end to add each message object to the map message array, it will
     //look like a format of accending to decending chat like format
    
    if (result) {

        res.json(result)
   
    }
     

     }).catch((error) => {

          res.json(error)

     });

     }


}

module.exports = fetchOldMessagesWithThisUser;