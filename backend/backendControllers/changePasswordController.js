//SERVER COMPONENT TO CHANGE USER'S PASSWORD.
const userModel = require("../models/userModel");
const bcrypt = require('bcrypt')

const changePassword = (req, res) => {

    const name = req.body.loggedInUser;
    const password = req.body.passcode;
    
    //HASHING THE PASSWORD
    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (name && hashedPassword) { 

      userModel.updateOne({name: name}, {$set:  {password: hashedPassword} }).then((data) => {

        if (data) {
            console.log('change done.' + data)
            res.json({result: 'password change complete.'})
        }
        
        }).catch((err) => {
                console.log(err)
            res.json({resultError: 'Error while updating password.'})
        })


    }

}

module.exports = changePassword;