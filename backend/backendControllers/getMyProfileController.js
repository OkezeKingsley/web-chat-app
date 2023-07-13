const userModel = require("../models/userModel");

const getMyProfile = (req, res) => {

    const name = req.body.name;
    
    try {

        userModel.findOne({name}, (err, data) => {

            if (err) {

                res.json(err);

            } 

            if (data) {

                res.json(data)
                console.log(data)

            }
            
        });

    } catch (err) {

        console.log('db err on getting user profile: ' + err)
    }
}

module.exports = getMyProfile;