const userModel = require('../models/userModel')

const uploadProfilePhoto = async (req, res) => {
   // console.log(req.body)
   const myFile = req.body.myFile;
   const name = req.body.name;

   console.log('image is: ' +  name)

   try { 

        if (name) {

        await userModel.findOneAndUpdate({name: name}, {profile_picture: myFile}).then((data) => {

            if (data) {

                console.log('profile photo uploaded!');

                res.json({result: 'profile photo uploaded!'})
            }
            

            }).catch((error) => {

            res.json({result: 'error while uploading picture'})
            
            console.log('error communicating with the database for profile picture upload: ' + error)

            })



        }

    } catch (err) {

            console.log('db connection err on uploading profile photo: ' + err)
    }

    
}
 
module.exports = uploadProfilePhoto;